import csv
import coinach
import json
import yaml
from pathlib import Path
import os
import re
import requests
import sys
import argparse

base = "https://xivapi.com/"

# First argument is the API key
if len(sys.argv) > 1:
    xivapi_key = sys.argv[1]
else:
    xivapi_key = False


def xivapi(content, filters={}):
    """Fetches content columns from XIVAPI"""
    page = 1
    url = f"{base}{content}"
    by_id = False

    # IDs are just part of the url path
    if "id" in filters:
        url += "/" + str(filters["id"])
        by_id = True
        del filters["id"]

    # Add the key
    url += "?"
    if xivapi_key:
        url += f"key={xivapi_key}"

    # Filters are added onto the URL as a query string
    if len(filters):
        for key, value in filters.items():
            url += "&"

            if type(value) is list:
                # Collapse lists into comma-seperated strings
                url += f'{key}={",".join(str(x) for x in value)}'
            else:
                url += f"{key}={value}"

    response = requests.get(f"{url}&page={page}").json()

    if not by_id:
        results = response["Results"]
    else:
        # Searches by ID do not have pagination separate from results
        results = response

    # Loop requests until the page is over
    while not by_id and response["Pagination"]["Page"] != response["Pagination"]["PageTotal"]:
        page += 1
        response = requests.get(f"{url}&page={page}")
        if response.status_code != 200:
            print(response.status_code)
            print(response.headers)
            print(response.text)
            exit()

        response = response.json()

        results += response["Results"]

    return results

def world_localize(name):
    d = {
        "LaNuoXiYa": "拉诺西亚",
        "ZiShuiZhanQiao": "紫水栈桥",
        "HuanYingQunDao": "幻影群岛",
        "MoDuNa": "摩杜纳",
        "MengYaChi": "萌芽池",
        "BaiJinHuanXiang": "白金幻象",
        "ShenYiZhiDi": "神意之地",
        "JingYuZhuangYuan": "静语庄园",
        "LvRenZhanQiao": "旅人栈桥",
        "FuXiaoZhiJian": "拂晓之间",
        "Longchaoshendian": "龙巢神殿",
        "HongYuHai": "红玉海",
        "HuangJinGang": "黄金港",
        "YanXia": "延夏",
        "ChaoFengTing": "潮风亭",
        "ShenQuanHen": "神拳痕",
        "BaiYinXiang": "白银乡",
        "YuZhouHeYin": "宇宙和音",
        "WoXianXiRan": "沃仙曦染",
        "ChenXiWangZuo": "晨曦王座",
        "MengYuBaoJing": "梦羽宝境",
        "HaiMaoChaWu": "海猫茶屋",
        "RouFengHaiWan": "柔风海湾",
        "HuPoYuan": "琥珀原",
        "KrChocobo": "초코보",
        "KrMoogle": "모그리",
        "KrCarbuncle": "카벙클",
        "KrTonberry": "톤베리"
    }
    return d[name] if name in d else name

def get_world_data():
    """Returns dictionaries for world id->name mapping"""
    # Generate the columns needed
    columns = ["ID", "Name"]

    results = xivapi("World", {"columns": columns})

    # Build the data dicts from results
    data = {}
    for world in results:
        world_id, world_name = world["ID"], world["Name"]
        world_name = world_localize(world_name)
        data[world_id] = world_name

    return data



if __name__ == "__main__":
    example_usage = "python3 gen_world_data.py"
    parser = argparse.ArgumentParser(
        description="Generate world name data from xivapi",
        epilog=example_usage,
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    args = parser.parse_args()

    data = get_world_data()

    filename = Path(__file__).resolve().parent.parent / "resources" / "world.js"
    writer = coinach.CoinachWriter()
    writer.write(filename, os.path.basename(os.path.abspath(__file__)), "gWorldIdToName", data)
