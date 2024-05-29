import { request } from './axios'

export class T1YClient {
    // 添加一条数据
    static async createOne(collection: string, params: any) {
        return request(`/v5/classes/${collection}`, params, 'post')
    }
    // 删除一条数据
    static async deleteOne(collection: string, id: string) {
        return request(`/v5/classes/${collection}/${id}`, {}, 'delete')
    }
    // 更新一条数据
    static async updateOne(collection: string, id: string, params: any) {
        return request(`/v5/classes/${collection}/${id}`, params, 'put')
    }
    // 查询一条数据
    static async findOne(collection: string, id: string) {
        return request(`/v5/classes/${collection}/${id}`, {}, 'get')
    }
    // 查询全部数据（分页查询）
    static async findAll(collection: string, page: number, size: number) {
        return request(
            `/v5/classes/${collection}?page=${page}&size=${size}`,
            {},
            'get',
        )
    }
    // 批量添加数据
    static async createMany(collection: string, params: any) {
        return request(`/v5/classes/${collection}/batch`, params, 'post')
    }
    // 批量删除数据
    static async deleteMany(collection: string, params: any) {
        return request(`/v5/classes/${collection}/batch`, params, 'delete')
    }
    // 批量更新数据
    static async updateMany(collection: string, params: any) {
        return request(`/v5/classes/${collection}/batch`, params, 'put')
    }
    // 高级查询（分页、排序、比较）
    static async query(collection: string, params: any) {
        return request(`/v5/classes/${collection}/query`, params, 'post')
    }
    // 聚合查询（分组、聚合、运算）
    static async aggregate(collection: string, params: any) {
        return request(`/v5/classes/${collection}/aggregate`, params, 'post')
    }
    // 查询所有集合
    static async getAllCollections() {
        return request(`/v5/schemas`, {}, 'get')
    }
    // 创建集合
    static async createCollection(collection: string) {
        return request(`/v5/schemas/${collection}`, {}, 'post')
    }
    // 清空集合
    static async clearCollection(collection: string) {
        return request(`/v5/schemas/${collection}`, {}, 'put')
    }
    // 删除集合
    static async deleteCollection(collection: string) {
        return request(`/v5/schemas/${collection}`, {}, 'delete')
    }
    // 发送邮件
    static async sendEmail(params: any) {
        return request(`/v5/sys/email`, params, 'post')
    }
    // 发送短信验证码
    static async sendSMSCode(phone: string) {
        return request(`/v5/sys/code?phone=${phone}`, {}, 'get')
    }
    // 调用云函数
    static async callFunc(name: string, params: any) {
        return request(
            `/${import.meta.env.VITE_APP_APP_ID}/${name}`,
            params,
            'post',
        )
    }
}
