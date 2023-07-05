/***
 * @file:
 * @author: caojianping
 * @Date: 2023-07-05 19:34:14
 */

import queryString from 'query-string';
import { IOpenPlatformUrl } from '../interfaces';

/**
 * 解析链接地址
 * @param key 具体平台对应的app编号：飞书appId；钉钉corpId；
 * @returns 返回开放平台链接地址配置对象
 */
export function resolveUrl(key: string): IOpenPlatformUrl {
  const { search, hash } = window.location;
  let value = '';
  if (search) {
    value = search;
  } else {
    const matches = hash.match(new RegExp('\\?.+'));
    value = matches ? matches[0] || '' : '';
  }
  const query = queryString.parse(value);
  const data = query && query[key] ? String(query[key]) : '';
  const agAppId = query && query.agAppId ? String(query.agAppId) : '';
  return { agAppId, [key]: data } as IOpenPlatformUrl;
}
