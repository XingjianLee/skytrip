import requests
import os
import time

# 科技背景图片URL列表（免费使用的图片链接）
background_image_urls = [
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1920&h=1080&fit=crop",  # 抽象科技背景
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&h=1080&fit=crop",  # 数字数据背景
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&h=1080&fit=crop",  # 电路科技背景
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&h=1080&fit=crop",  # 科技蓝光背景
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop"   # 未来科技背景
]

# 保存目录
save_dir = "d:\\competition\\skytrip\\admin-frontend\\public\\images\\backgrounds"

def download_images():
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    
    for i, url in enumerate(background_image_urls):
        try:
            print(f"正在下载第 {i+1} 张图片...")
            response = requests.get(url, timeout=10)
            response.raise_for_status()
            
            # 保存图片
            image_path = os.path.join(save_dir, f"tech_background_{i+1}.jpg")
            with open(image_path, 'wb') as f:
                f.write(response.content)
            
            print(f"第 {i+1} 张图片下载成功: {image_path}")
            time.sleep(1)  # 避免请求过快
            
        except Exception as e:
            print(f"下载第 {i+1} 张图片失败: {str(e)}")

if __name__ == "__main__":
    download_images()
    print("所有图片下载完成！")