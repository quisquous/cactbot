def _fetch(api_url, options):
    """Gets a url and handles any API errors"""
    # Make sure we have the requests library
    try:
        import requests
    except ImportError:
        raise ImportError("FFlogs parsing requires the Requests module for python. Run the following to install it:\npython -m pip install requests")

    response = requests.get(api_url, params=options)

    # Handle non-JSON response
    try:
        response_dict = response.json()
    except:
        raise Exception('Could not parse response: ' + response.text)

    # Handle bad request
    if response.status_code != 200:
        if 'error' in response_dict:
            raise Exception('FFLogs error: ' + response_dict['error'])
        else:
            raise Exception('Unexpected FFLogs error: ' + response.text)

    return response_dict

def api(call, report, prefix, options):
    """Makes a call to the FFLogs API and returns a dictionary"""
    if call != 'fights' and call != 'events':
        return {}

    if prefix not in ['www', 'fr', 'ja', 'de']:
      raise Exception('Invalid prefix: %s' % prefix)

    api_url = 'https://{}.fflogs.com:443/v1/report/{}/{}'.format(prefix, call, report)

    data = _fetch(api_url, options)

    # If this is a fight list, we're done already
    if call == 'fights':
        return data

    # If this is events, there might be more. Fetch until we have all of it
    while 'nextPageTimestamp' in data:
        # Set the new start time
        options = options.copy()
        options['start'] = data['nextPageTimestamp']

        # Get the extra data
        more_data = _fetch(api_url, options)

        # Add the new events to the existing data
        data['events'].extend(more_data['events'])

        # Continue the loop if there's more
        if 'nextPageTimestamp' in more_data:
            data['nextPageTimestamp'] = more_data['nextPageTimestamp']
        else:
            del data['nextPageTimestamp']
            break

    # Return the event data
    return data