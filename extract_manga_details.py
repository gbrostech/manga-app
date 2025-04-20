import requests
from bs4 import BeautifulSoup
import json
import time
import os
import re
from datetime import datetime
import shutil

# Función mejorada para limpiar títulos de volúmenes
def limpiar_titulo_html_mejorado(original_title):
    """
    Función mejorada que utiliza la estructura HTML para separar el título del número de páginas.
    Busca el carácter "nº" y, si existe, divide por el siguiente <br> después de ese carácter.
    """
    # Si hay un <br> en el título, podemos usar eso para separar
    if '<div style="height: 8px"></div>' and 'páginas' in original_title:
        marcador_inicio = '<div style="height: 8px"></div>'
        indice_inicio = original_title.find(marcador_inicio)
        subcadena = original_title[indice_inicio + len(marcador_inicio):]

        indice_inicio = subcadena.find('página')
        subcadena2 = subcadena[:indice_inicio]
        partes = subcadena2.split('<br/>')

        titulo = ' '.join(partes[:-1])
        return titulo
    
    if '<br>' in original_title:
        # Buscar el carácter "nº"
        if 'nº' in original_title:
            # Encontrar la posición de "nº"
            pos_num = original_title.find('nº')
            # Buscar el siguiente <br> después de "nº"
            pos_br = original_title.find('<br>', pos_num)
            
            if pos_br != -1:
                # Extraer el título hasta el <br> después de "nº"
                clean_title = original_title[:pos_br].strip()
                return clean_title
        
        # Si no hay "nº" o no hay <br> después de "nº", dividir por el primer <br>
        parts = original_title.split('<br>', 1)
        clean_title = parts[0].strip()
        return clean_title
    
    # Si no hay <br>, usar las expresiones regulares como respaldo
    # Caso para volúmenes con número y páginas juntos (ej: "nº1192 páginas")
    match = re.search(r'(nº\s*)(\d{1})(\d{3})(\s*páginas)', original_title)
    if match:
        # Volumen de 1 dígito seguido de 3 dígitos (páginas)
        prefix = match.group(1)  # "nº"
        volume_number = match.group(2)  # Número del volumen (1 dígito)
        
        # Construir el título limpio
        parts = original_title.split(match.group(0), 1)
        base_title = parts[0].strip()
        clean_title = f"{base_title} {prefix}{volume_number}"
        return clean_title
    
    # Caso para volúmenes de 2 dígitos (ej: "nº10192 páginas")
    match = re.search(r'(nº\s*)(\d{2})(\d{3})(\s*páginas)', original_title)
    if match:
        # Volumen de 2 dígitos seguido de 3 dígitos (páginas)
        prefix = match.group(1)  # "nº"
        volume_number = match.group(2)  # Número del volumen (2 dígitos)
        
        # Construir el título limpio
        parts = original_title.split(match.group(0), 1)
        base_title = parts[0].strip()
        clean_title = f"{base_title} {prefix}{volume_number}"
        return clean_title
    
    # Caso para volúmenes de 3 dígitos (ej: "nº100192 páginas")
    match = re.search(r'(nº\s*)(\d{3})(\d{3})(\s*páginas)', original_title)
    if match:
        # Volumen de 3 dígitos seguido de 3 dígitos (páginas)
        prefix = match.group(1)  # "nº"
        volume_number = match.group(2)  # Número del volumen (3 dígitos)
        
        # Construir el título limpio
        parts = original_title.split(match.group(0), 1)
        base_title = parts[0].strip()
        clean_title = f"{base_title} {prefix}{volume_number}"
        return clean_title
    
    # Caso para volúmenes con formato diferente (ej: "nº1 192 páginas")
    match = re.search(r'(nº\s*)(\d+)(\s+\d+\s*páginas)', original_title)
    if match:
        prefix = match.group(1)  # "nº"
        volume_number = match.group(2)  # Número del volumen
        
        # Construir el título limpio
        parts = original_title.split(match.group(0), 1)
        base_title = parts[0].strip()
        clean_title = f"{base_title} {prefix}{volume_number}"
        return clean_title
    
    # Intentar con otros patrones comunes si no encontramos los patrones específicos
    match = re.search(r'(n[°º]\s*)(\d+)', original_title)
    if match:
        prefix = match.group(1)  # "nº" o "n°"
        volume_number = match.group(2)  # Número del volumen
        
        # Construir el título limpio
        parts = original_title.split(match.group(0), 1)
        base_title = parts[0].strip()
        clean_title = f"{base_title} {prefix}{volume_number}"
        return clean_title
    
    # Otros formatos (Vol., #, etc.)
    match = re.search(r'(#\s*(\d+)|[Vv]ol\.\s*(\d+))', original_title)
    if match:
        # Determinar qué grupo capturó el número
        volume_number = None
        for group_index in range(2, 4):
            if match.group(group_index):
                volume_number = match.group(group_index)
                break
        
        prefix_text = match.group(1).split(volume_number)[0]
        
        # Dividir el título en la parte base
        parts = original_title.split(match.group(1), 1)
        base_title = parts[0].strip()
        
        # Construir el título limpio
        clean_title = f"{base_title} {prefix_text}{volume_number}"
        return clean_title
    
    # Si no encontramos ningún patrón conocido, simplemente eliminar información adicional
    clean_title = re.sub(r'\d+\s*páginas|\d+\s*€|en\s+B\/N|\d+,\d+\s*€', '', original_title)
    clean_title = re.sub(r'\s+,', ',', clean_title)  # Eliminar espacios antes de comas
    return clean_title.strip()

# Función para extraer detalles de un manga individual
def extract_manga_details(url, manga_id):
    print(f"Extrayendo detalles del manga ID {manga_id}: {url}")
    
    # Realizar la solicitud HTTP
    try:
        response = requests.get(url)
        response.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"Error al acceder a la URL {url}: {e}")
        return None
    
    # Parsear el contenido HTML
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extraer título
    titulo = ""
    titulo_element = soup.select_one('h2')
    if titulo_element:
        titulo = titulo_element.text.strip()
    
    # Extraer sinopsis - Método mejorado
    sinopsis = ""
    # Buscar específicamente "Sinopsis de [título del manga]"
    sinopsis_header = None
    for header in soup.find_all('h2'):
        if "Sinopsis de" in header.text:
            sinopsis_header = header
            break
    
    if sinopsis_header:
        # Buscar el contenido de la sinopsis en el párrafo siguiente
        sinopsis_container = sinopsis_header.find_parent('td')
        if sinopsis_container:
            # Eliminar el título y la línea horizontal
            for element in sinopsis_container.find_all(['h2', 'hr']):
                element.decompose()
            sinopsis = sinopsis_container.text.strip()
    
    # Si no se encontró con el método anterior, buscar después de "Números editados"
    if not sinopsis:
        numeros_editados = soup.find(string=re.compile("Números editados", re.IGNORECASE))
        if numeros_editados and numeros_editados.find_parent('table'):
            numeros_table = numeros_editados.find_parent('table').find_parent('table').find_parent('table')
            if numeros_table and numeros_table.find_next_sibling('table'):
                sinopsis_table = numeros_table.find_next_sibling('table').find_next_sibling('table')
                if sinopsis_table:
                    sinopsis_text = sinopsis_table.find('td')
                    if sinopsis_text:
                        # Eliminar el título y la línea horizontal si existen
                        for element in sinopsis_text.find_all(['h2', 'hr']):
                            element.decompose()
                        sinopsis = sinopsis_text.text.strip()
    
    # Extraer autor
    autor = ""
    # Buscar primero en "Guion"
    guion_label = soup.find(string=re.compile("Guion:", re.IGNORECASE))
    if guion_label and guion_label.find_next():
        autor_element = guion_label.find_next('a')
        if autor_element:
            autor = autor_element.text.strip()
    
    # Si no se encuentra en Guion, buscar en Dibujo
    if not autor:
        dibujo_label = soup.find(string=re.compile("Dibujo:", re.IGNORECASE))
        if dibujo_label and dibujo_label.find_next():
            autor_element = dibujo_label.find_next('a')
            if autor_element:
                autor = autor_element.text.strip()
    
    # Extraer volúmenes
    volumes_data = []
    
    # Buscar en "Números editados"
    numeros_editados = soup.find(string=re.compile("Números editados", re.IGNORECASE))
    if numeros_editados:
        # Buscar todas las tablas que contienen imágenes (volúmenes)
        all_tables = soup.find_all('table')
        volume_number = 1
        
        for table in all_tables:
            # Buscar imágenes dentro de la tabla
            img_tags = table.find_all('img')
            for img_tag in img_tags:
                # Verificar si esta imagen pertenece a un volumen
                parent_td = img_tag.find_parent('td')
                if parent_td and parent_td.text and ('páginas' in parent_td.text or 'nº' in parent_td.text.lower()):
                    volume = {
                        "id_manga": manga_id,
                        "numero": volume_number,
                        "titulo": "",
                        "fecha": "",
                        "imagen": f"tomos/{manga_id}/{volume_number}.jpg",  # Formato de ruta local
                        "amazon_link": ""
                    }
                    
                    # Extraer texto completo de la celda
                    cell_text = parent_td.text.strip()
                    text_lines = [line.strip() for line in cell_text.split('\n') if line.strip()]
                    
                    # Extraer título del volumen (primera línea del texto)
                    if text_lines:
                        # Preservar el HTML para la limpieza posterior
                        volume["titulo"] = str(parent_td)
                    
                    # Extraer fecha (buscar enlace con fecha o última línea)
                    fecha_element = parent_td.find('a', string=re.compile(r'\w+ \d{4}'))
                    if fecha_element:
                        volume["fecha"] = fecha_element.text.strip()
                    elif len(text_lines) > 1:
                        # Buscar un patrón de fecha en las líneas de texto
                        for line in text_lines:
                            if re.search(r'\w+ \d{4}', line):
                                volume["fecha"] = line
                                break
                        # Si no se encontró, usar la última línea
                        if not volume["fecha"] and len(text_lines) > 1:
                            volume["fecha"] = text_lines[-1]
                    
                    # Extraer imagen URL para descargar (pero no para el JSON)
                    img_url = ""
                    if img_tag.get('src'):
                        img_url = img_tag['src']
                        if not img_url.startswith('http'):
                            img_url = f"https://www.listadomanga.es/{img_url}"
                    
                    # Extraer enlace de Amazon si existe
                    amazon_link = parent_td.find('a', href=re.compile("amazon"))
                    if amazon_link:
                        volume["amazon_link"] = amazon_link['href']
                    
                    volumes_data.append((volume, img_url))
                    volume_number += 1
    
    # Extraer número de volúmenes
    volumenes = len(volumes_data)
    
    # Extraer fecha de publicación (del primer volumen si existe)
    fecha = ""
    if volumes_data:
        fecha_str = volumes_data[0][0]["fecha"]
        # Intentar extraer mes y año de la fecha del primer volumen
        match = re.search(r'(\w+)\s+(\d{4})', fecha_str)
        if match:
            mes_str, anio = match.groups()
            # Convertir nombre del mes a número
            meses = {
                'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
                'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
                'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
            }
            mes = meses.get(mes_str.lower(), '01')  # Default a 01 si no se encuentra
            fecha = f"{mes}/{anio}"
        else:
            # Si solo hay año, usar mes por defecto 01
            match = re.search(r'(\d{4})', fecha_str)
            if match:
                anio = match.group(1)
                fecha = f"01/{anio}"
    
    # Extraer imagen de portada
    portada_url = ""
    # Buscar en la sección de "Números editados"
    if volumes_data:
        portada_url = volumes_data[0][1]  # Usar la URL de la primera imagen
    
    # Crear estructura de datos del manga
    manga_data = {
        "id": manga_id,
        "titulo": titulo,
        "fecha": fecha,
        "autor": autor,
        "sinopsis": sinopsis,
        "volumenes": volumenes,
        "foto_portada": f"/images/portadas/{manga_id}.jpg",
        "foto_fondo": "",
        "foto_logo": "",
        "amazon_link": ""
    }
    
    # Extraer solo los volúmenes sin las URLs
    volumes_only = [vol[0] for vol in volumes_data]
    
    # Extraer las URLs de imágenes para descargar
    image_urls = [(vol[0]["id_manga"], vol[0]["numero"], vol[1]) for vol in volumes_data]
    
    return {
        "manga": manga_data,
        "volumes": volumes_only,
        "image_urls": image_urls,
        "portada_url": portada_url
    }

# Función para descargar imagen
def download_image(url, save_path):
    try:
        response = requests.get(url, stream=True)
        response.raise_for_status()
        
        # Crear directorio si no existe
        os.makedirs(os.path.dirname(save_path), exist_ok=True)
        
        with open(save_path, 'wb') as out_file:
            shutil.copyfileobj(response.raw, out_file)
        
        print(f"Imagen descargada: {save_path}")
        return True
    except Exception as e:
        print(f"Error al descargar imagen {url}: {e}")
        return False

# Función principal para procesar todos los mangas
def process_mangas(input_json_path, limit=None):
    # Crear directorios necesarios
    os.makedirs("tomos", exist_ok=True)
    os.makedirs("images/portadas", exist_ok=True)
    
    # Cargar datos de manga existentes
    with open(input_json_path, 'r', encoding='utf-8') as f:
        mangas_list = json.load(f)
    
    # Limitar el número de mangas a procesar si se especifica
    if limit:
        mangas_list = mangas_list[:limit]
    
    # Listas para almacenar los datos procesados
    mangas_data = []
    volumes_data = []
    
    # Procesar cada manga
    for i, manga in enumerate(mangas_list, 1):
        print(f"Procesando manga {i}/{len(mangas_list)}")
        
        # Extraer detalles del manga
        result = extract_manga_details(manga['url'], i)
        
        if result:
            # Añadir el campo tipo si existe en el manga original
            if 'tipo' in manga:
                result['manga']['tipo'] = manga['tipo']
            else:
                result['manga']['tipo'] = ""
            
            # Añadir datos del manga
            mangas_data.append(result['manga'])
            
            # Añadir datos de volúmenes
            volumes_data.extend(result['volumes'])
            
            # Descargar imagen de portada
            if result['portada_url']:
                portada_path = f"images/portadas/{i}.jpg"
                download_image(result['portada_url'], portada_path)
            
            # Descargar imágenes de volúmenes
            for manga_id, volume_num, img_url in result['image_urls']:
                if img_url:
                    # Crear directorio para las imágenes de este manga
                    os.makedirs(f"tomos/{manga_id}", exist_ok=True)
                    
                    # Descargar imagen
                    volume_img_path = f"tomos/{manga_id}/{volume_num}.jpg"
                    download_image(img_url, volume_img_path)
        
        # Pausa para no sobrecargar el servidor
        time.sleep(1)
    
    # Guardar datos de mangas en JSON
    with open('mangas_detailed.json', 'w', encoding='utf-8') as f:
        json.dump(mangas_data, f, ensure_ascii=False, indent=2)
    
    # Guardar datos de volúmenes en JSON
    with open('volumes.json', 'w', encoding='utf-8') as f:
        json.dump(volumes_data, f, ensure_ascii=False, indent=2)
    
    # Limpiar títulos de volúmenes con la función mejorada
    clean_volume_titles('volumes.json')
    
    # Crear archivo ZIP con imágenes de volúmenes
    if os.path.exists('tomos') and os.listdir('tomos'):
        shutil.make_archive('tomos', 'zip', 'tomos')
        print("Archivo ZIP de imágenes creado: tomos.zip")
    else:
        print("No se creó archivo ZIP porque no hay imágenes de volúmenes")
    
    print(f"Proceso completado. Se procesaron {len(mangas_data)} mangas y {len(volumes_data)} volúmenes.")
    return len(mangas_data), len(volumes_data)

# Función para limpiar los títulos de volúmenes (versión integrada con HTML)
def clean_volume_titles(volumes_json_path):
    """Limpia los títulos de volúmenes utilizando la función mejorada."""
    print("Limpiando títulos de volúmenes con enfoque HTML mejorado...")
    
    # Cargar el JSON de volúmenes
    with open(volumes_json_path, 'r', encoding='utf-8') as f:
        volumes = json.load(f)
    
    # Limpiar títulos con la función mejorada
    for volume in volumes:
        original_title = volume["titulo"]
        volume["titulo"] = limpiar_titulo_html_mejorado(original_title)
    
    # Guardar el JSON actualizado
    with open('volumes_fixed.json', 'w', encoding='utf-8') as f:
        json.dump(volumes, f, ensure_ascii=False, indent=2)
    
    print(f"Títulos de volúmenes limpiados con enfoque HTML mejorado y guardados en volumes_fixed.json")
    return True

# Punto de entrada del script
if __name__ == "__main__":
    # Usar el archivo JSON combinado como entrada
    input_json = 'mangas_combined.json'
    
    # Para pruebas, limitar a un número pequeño de mangas
    # Comentar esta línea para procesar todos los mangas
    limit_mangas = None
    
    # Procesar mangas
    num_mangas, num_volumes = process_mangas(input_json, limit_mangas)
    
    print(f"Resumen final:")
    print(f"- Mangas procesados: {num_mangas}")
    print(f"- Volúmenes procesados: {num_volumes}")
    print(f"- Archivos generados: mangas_detailed.json, volumes_fixed.json, tomos.zip")
