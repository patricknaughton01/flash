import re

def main():
    with open("lang_codes", 'r') as f:
        file_str = f.read()
        matches = re.findall(r"hl=(.*?) +(.*?)\n", file_str)
        with open("out.txt", "w") as w:
            for match in matches:
                w.write('<option value="' + str(match[0]) + '">' + str(match[1]) + '</option>\n')
    

if __name__ == "__main__":
    main()
