import replicate
output = replicate.run(
    "lucataco/sdxl-inpainting:a5b13068cc81a89a4fbeefeccc774869fcb34df4dbc92c1555e0f2771d49dde7",
    input={
        "mask": "https://replicate.delivery/pbxt/LWV2QACcJvSwI0kD0W70wBa63Wjzp5GXvKNRGFm7jDlpf7jC/1080x1920.png",
        "seed": 111,
        "image": "https://replicate.delivery/pbxt/LWV2QEeVlyyOEEFK4hyWFW6dzArTlt20bRoyKP40ZWyFw4jl/bill1080x1920.png.png",
        "steps": 20,
        "prompt": "A young man in a blue denim jacket and black pants",
        "strength": 1,
        "scheduler": "K_EULER",
        "num_outputs": 1,
        "guidance_scale": 8,
        "negative_prompt": "lowres, bad anatomy, worst quality, low quality"
    }
)
print(output)