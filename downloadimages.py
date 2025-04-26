import os
import json
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
# Cargar el JSON de mangas
with open("mangas_filtered.json", "r", encoding="utf-8") as f:
    mangas = json.load(f)

# Configurar Selenium (headless opcional)
options = Options()
options.add_argument("--headless")  # Puedes quitar esto si quieres ver el navegador
options.add_argument("--disable-gpu")
options.add_argument("--no-sandbox")
driver = webdriver.Chrome(options=options)

# Archivo de salida
output_file = "urls_imagenes.txt"

def obtener_url_imagen_real(titulo_manga: str) -> str:
    query = f"manga {titulo_manga} castellano"
    driver.get(f"https://www.google.com/search?tbm=isch&q={query}")
    time.sleep(2)

    try:
        # Clic en la primera miniatura
        thumbnails = driver.find_elements(By.CSS_SELECTOR, "img.Q4LuWd")
        if thumbnails:
            thumbnails[0].click()
            time.sleep(2)

            # Buscar imagen grande
            images = driver.find_elements(By.CSS_SELECTOR, "img.n3VNCb")
            for img in images:
                src = img.get_attribute("src")
                if src and src.startswith("http") and "encrypted-tbn" not in src:
                    return src
    except Exception as e:
        print(f"⚠️ Error obteniendo imagen: {e}")
    return None

# Guardar resultados
with open(output_file, "w", encoding="utf-8") as f_out:
    for manga in mangas[:10]:
        titulo = manga.get("titulo")
        print(f" Buscando: {query}")

        image_url = get_real_image_url(query)
        if image_url:
            f_out.write(image_url + "\n")
            print(f" URL guardada: {image_url}")
        else:
            print(f" No se encontró imagen para: {titulo}")