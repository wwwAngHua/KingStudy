import requests

apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhc2dxenRlYWt5anlqbnVtb3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzI3MDksImV4cCI6MjA1MTU0ODcwOX0.kDZGCdDbz1iwxB74wg8mVOqvZFjBB9piAW-B2cP992w'
bearer_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhhc2dxenRlYWt5anlqbnVtb3NiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU5NzI3MDksImV4cCI6MjA1MTU0ODcwOX0.kDZGCdDbz1iwxB74wg8mVOqvZFjBB9piAW-B2cP992w'
url = 'https://xasgqzteakyjyjnumosb.supabase.co/rest/v1/news'

params = {
    'select': 'id,title,image',
    'draft': 'eq.false',
    'offset': 0,
    'limit': 10000000,
    'order': 'created_at.desc'
}

headers = {
    'apikey': apikey,
    'Authorization': f'Bearer {bearer_token}'
}

response = requests.get(url, params=params, headers=headers)

print("请求 URL:", response.url)
print("响应状态码:", response.status_code)
print("响应内容:", response.text)
