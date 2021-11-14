import UserConfig from '../../resources/user_config';
import { BaseOptions } from '../../types/data';

const defaultConfigConfigOptions = {
  CactbotUserDirectory: '',
  ShowDeveloperOptions: false,
};
type ConfigConfigOptions = typeof defaultConfigConfigOptions;

export interface ConfigOptions extends BaseOptions, ConfigConfigOptions {}

const Options: ConfigOptions = {
  ...UserConfig.getDefaultBaseOptions(),
  ...defaultConfigConfigOptions,
};

export default Options;
