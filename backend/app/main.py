# Every day above ground is a great day, remember that!

from ml.cv_parser import extract_cv_text
from ml.skill_extractor import analyze_cv_text

result = extract_cv_text(r'C:\Users\thoma\Downloads\Thomas Gollick CV 2024.pdf')
analysis = analyze_cv_text(result)

print("TEXT EXTRACTION:\n" + result)
print("\nANALYSIS:\n")

for key, value in analysis.items():
    print(key);

    if key == "experience_years":
        print(value)
    else:
        for item in value:
            print(item)

    print("\n")