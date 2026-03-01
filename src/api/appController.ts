/* eslint-disable */
import request from '@/utils/request'

/** 创建应用 POST /app/add */
export async function addApp(body: API.AppAddRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseLong>('/app/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 应用聊天生成代码（流式 SSE） GET /app/chat/gen/code */
export async function chatToGenCode(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.chatToGenCodeParams,
  options?: { [key: string]: any },
) {
  return request<API.ServerSentEventString[]>('/app/chat/gen/code', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 删除应用（用户只能删除自己的应用） POST /app/delete */
export async function deleteApp(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/app/delete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 删除应用（管理员可以删除任意应用） POST /app/delete/admin */
export async function deleteAppAdmin(body: API.DeleteRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/app/delete/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 应用部署 POST /app/deploy */
export async function deployApp(body: API.AppDeployRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseString>('/app/deploy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 根据 id 获取应用详情（用户只能查看自己的应用） GET /app/get */
export async function getApp(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAppParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseAppVO>('/app/get', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 根据 id 获取应用详情（管理员可以查看任意应用） GET /app/get/admin */
export async function getAppAdmin(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getAppAdminParams,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseAppVO>('/app/get/admin', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /app/getInfo/${param0} */
export async function getInfo1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getInfo1Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params
  return request<API.App>(`/app/getInfo/${param0}`, {
    method: 'GET',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /app/list */
export async function list1(options?: { [key: string]: any }) {
  return request<API.App[]>('/app/list', {
    method: 'GET',
    ...(options || {}),
  })
}

/** 分页查询精选的应用列表 POST /app/list/featured/page */
export async function listFeaturedAppsByPage(
  body: API.AppQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageAppVO>('/app/list/featured/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页查询当前用户自己的应用列表 POST /app/list/my/page */
export async function listMyAppsByPage(
  body: API.AppQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageAppVO>('/app/list/my/page', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 分页查询应用列表（管理员） POST /app/list/page/admin */
export async function listAppsByPageAdmin(
  body: API.AppQueryRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponsePageAppVO>('/app/list/page/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 GET /app/page */
export async function page1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.page1Params,
  options?: { [key: string]: any },
) {
  return request<API.PageApp>('/app/page', {
    method: 'GET',
    params: {
      ...params,
      page: undefined,
      ...params['page'],
    },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 DELETE /app/remove/${param0} */
export async function remove1(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.remove1Params,
  options?: { [key: string]: any },
) {
  const { id: param0, ...queryParams } = params
  return request<boolean>(`/app/remove/${param0}`, {
    method: 'DELETE',
    params: { ...queryParams },
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 POST /app/save */
export async function save1(body: API.App, options?: { [key: string]: any }) {
  return request<boolean>('/app/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 此处后端没有提供注释 PUT /app/update */
export async function update1(body: API.App, options?: { [key: string]: any }) {
  return request<boolean>('/app/update', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 更新应用（用户只能更新自己的应用） POST /app/update */
export async function updateApp(body: API.AppUpdateRequest, options?: { [key: string]: any }) {
  return request<API.BaseResponseBoolean>('/app/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}

/** 更新应用（管理员可以更新任意应用） POST /app/update/admin */
export async function updateAppAdmin(
  body: API.AppAdminUpdateRequest,
  options?: { [key: string]: any },
) {
  return request<API.BaseResponseBoolean>('/app/update/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  })
}
