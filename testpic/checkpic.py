import torch
from PIL import Image
import numpy as np

def print_tensor_info(tensor, name):
    print(f"{name}:")
    print(f"  Shape: {tensor.shape}")
    print(f"  Dtype: {tensor.dtype}")
    print(f"  Device: {tensor.device}")
    print(f"  Min: {tensor.min().item()}, Max: {tensor.max().item()}")
    print()

def print_image_info(image_path):
    try:
        with Image.open(image_path) as img:
            print(f"Image: {image_path}")
            print(f"  Format: {img.format}")
            print(f"  Mode: {img.mode}")
            print(f"  Size: {img.size}")
            
            # Convert to numpy array and then to tensor
            np_img = np.array(img)
            tensor_img = torch.from_numpy(np_img).float()
            
            print_tensor_info(tensor_img, "Image Tensor")
    except Exception as e:
        print(f"Error processing {image_path}: {str(e)}")
    print()

# 假设的张量尺寸，基于错误信息
original_samples = torch.randn(1, 4, 64, 576)
noise = torch.randn(1, 4, 64, 72)
sigma = torch.tensor([0.5])

print_tensor_info(original_samples, "original_samples")
print_tensor_info(noise, "noise")
print_tensor_info(sigma, "sigma")

# 打印两张图片的信息
print_image_info("./1080x1920.png")
print_image_info("./bill1080x1920.png.png")