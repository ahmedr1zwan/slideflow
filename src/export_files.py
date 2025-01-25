import os

def find_js_files(root_dir):
    js_files = []
    for subdir, _, files in os.walk(root_dir):
        for file in files:
            if file.endswith(('.jsx', '.tsx', '.js')):
                js_files.append(os.path.join(subdir, file))
    return js_files

def write_to_output_file(js_files, output_file):
    with open(output_file, 'w') as f:
        for file in js_files:
            f.write(f"// {file}\n")
            with open(file, 'r') as jf:
                content = jf.read()
                f.write(content + "\n\n")

if __name__ == "__main__":
    root_directory = os.path.dirname(os.path.abspath(__file__))
    output_file = os.path.join(root_directory, 'src_code_output.txt')
    
    js_files = find_js_files(root_directory)
    write_to_output_file(js_files, output_file)