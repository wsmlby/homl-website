import os
import shutil
import json
from jinja2 import Environment, FileSystemLoader
import markdown2
import frontmatter

# 1. Set up paths
SRC_DIR = 'src'
STATIC_DIR = 'static'
OUTPUT_DIR = 'docs'
MODEL_CONFIGS_DIR = 'model-configs'
BLOGS_DIR = os.path.join(SRC_DIR, 'blogs')
MODELS_OUTPUT_DIR = os.path.join(OUTPUT_DIR, 'models')
BLOGS_OUTPUT_DIR = os.path.join(OUTPUT_DIR, 'blogs')

# Clean up the output directory
if os.path.exists(OUTPUT_DIR):
    shutil.rmtree(OUTPUT_DIR)
os.makedirs(MODELS_OUTPUT_DIR)
os.makedirs(BLOGS_OUTPUT_DIR)

# 2. Copy static files and model configs
shutil.copytree(MODEL_CONFIGS_DIR, os.path.join(OUTPUT_DIR, MODEL_CONFIGS_DIR))
for item in os.listdir(STATIC_DIR):
    source_item = os.path.join(STATIC_DIR, item)
    dest_item = os.path.join(OUTPUT_DIR, item)
    if os.path.isdir(source_item):
        shutil.copytree(source_item, dest_item)
    else:
        shutil.copy2(source_item, dest_item)

# 3. Set up Jinja2 environment
env = Environment(loader=FileSystemLoader(SRC_DIR), trim_blocks=True, lstrip_blocks=True)

# 4. Load model configurations
models = []
for filename in os.listdir(MODEL_CONFIGS_DIR):
    if filename.endswith('.json'):
        with open(os.path.join(MODEL_CONFIGS_DIR, filename), 'r') as f:
            model_data = json.load(f)
            model_data['path'] = f"/models/{model_data['name']}.html"
            
            # Process variants from dictionary
            variants = []
            if 'variants' in model_data and isinstance(model_data['variants'], dict):
                for variant_name, variant_details in model_data['variants'].items():
                    variant_details['name'] = variant_name
                    variant_details['pull_command'] = f"homl pull {model_data['name']}:{variant_name}"
                    variants.append(variant_details)
            
            model_data['variants'] = variants
            models.append(model_data)

# Sort models alphabetically by display name
models.sort(key=lambda x: x['display_name'])

# 5. Render model pages
model_template = env.get_template('models/model_page.html')
for model in models:
    output_path = os.path.join(OUTPUT_DIR, f"models/{model['name']}.html")
    html_content = model_template.render(model=model, title=model['display_name'], page='models')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

# 6. Render model index page
model_index_template = env.get_template('models/index.html')
html_content = model_index_template.render(models=models, title="Models", page='models')
output_path = os.path.join(MODELS_OUTPUT_DIR, 'index.html')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

# 7. Process and render blog posts
posts = []
for filename in os.listdir(BLOGS_DIR):
    if filename.endswith('.md'):
        filepath = os.path.join(BLOGS_DIR, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            post = frontmatter.load(f)
            post_data = post.metadata
            post_data['content'] = markdown2.markdown(post.content, extras=['fenced-code-blocks'])
            post_data['slug'] = filename.replace('.md', '')
            post_data['path'] = f"/blogs/{post_data['slug']}.html"
            posts.append(post_data)

posts.sort(key=lambda x: x['date'], reverse=True)

blog_template = env.get_template('templates/blog_page.html')
for post in posts:
    output_path = os.path.join(BLOGS_OUTPUT_DIR, f"{post['slug']}.html")
    html_content = blog_template.render(post=post, title=post['title'], page='blog')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(html_content)

# Render blog index page
blog_index_template = env.get_template('templates/blog_index.html')
html_content = blog_index_template.render(posts=posts, title="Blog", page='blog')
output_path = os.path.join(BLOGS_OUTPUT_DIR, 'index.html')
with open(output_path, 'w', encoding='utf-8') as f:
    f.write(html_content)

# 8. Find and render all HTML templates from src to docs
for root, dirs, files in os.walk(SRC_DIR):
    # Exclude 'templates', 'models' and 'blogs' directories from being processed directly
    if 'templates' in dirs:
        dirs.remove('templates')
    if 'models' in dirs:
        dirs.remove('models')
    if 'blogs' in dirs:
        dirs.remove('blogs')

    for filename in files:
        if filename.endswith('.html'):
            # Construct the full path relative to SRC_DIR
            template_path = os.path.relpath(os.path.join(root, filename), SRC_DIR)
            
            # Determine the output path
            output_path = os.path.join(OUTPUT_DIR, template_path)
            
            # Ensure the output directory exists
            os.makedirs(os.path.dirname(output_path), exist_ok=True)

            # Render the template
            template = env.get_template(template_path)
            html_content = template.render(page=template_path)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(html_content)

print(f"✅ Site built successfully in '{OUTPUT_DIR}' directory.")
