function main() {
    const name = 'news'
    const apikey =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhc2dxenRlYWt5anlqbnVtb3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzI3MDksImV4cCI6MjA1MTU0ODcwOX0.kDZGCdDbz1iwxB74wg8mVOqvZFjBB9piAW-B2cP992w'
    const bearer_token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhc2dxenRlYWt5anlqbnVtb3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzI3MDksImV4cCI6MjA1MTU0ODcwOX0.kDZGCdDbz1iwxB74wg8mVOqvZFjBB9piAW-B2cP992w'
    const resp = http.send(
        'GET',
        `https://xasgqzteakyjyjnumosb.supabase.co/rest/v1/news?select=id,title,url,image,content&draft=eq.false&offset=0&limit=1&order=created_at.desc`,
        {
            apikey: apikey,
            Authorization: `Bearer ${bearer_token}`,
        },
        null,
    )
    if (resp == null) {
        return '请求失败'
    }
    if (resp.statusCode != 200) {
        return '请求失败'
    }
    const data = JSON.parse(resp.body)
    const oldId = db.collection(name).find({}, 1, 1, { id: -1 })
    if (oldId != null) {
        if (data[0].id > oldId[0].id) {
            if (db.collection(name).createOne(data[0]) == null) {
                return '添加失败'
            }
        }
    }
    return 'lastId: ' + data[0].id
}
