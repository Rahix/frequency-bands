# Simple python script to add new entries


def gen_entry():
    ob = input("Operating Band: ")
    ul = input("Uplink(UL) lower: ")
    uu = input("Uplink(UL) upper: ")
    dl = input("Downlink(DL) lower: ")
    du = input("Downlink(DL) upper: ")
    dm = input("Duplex Mode: ")
    ne = input("Note(Leave empty for no note): ")
    if ne == "":
        ne = "-"
    return ",".join([ob, ul, uu, dl, du, dm, ne])

print("""Add frequency band to list:
Information:
- Uplink lower = F UL_low
- Uplink upper = F UL_high
- Downlink lower = F DL_low
- Downlink upper = F DL_high
- If only one band is used set the values for Uplink to the same as Downlink
""")

while True:
    entry = gen_entry()
    r = input("Is the above data correct(Y/N)?")
    if r == "Y" or r == "y" or r == "":
        f = open("data/fb.csv", "a")
        f.write(entry + "\n")
        f.close()
        print("Entry written.")
    else:
        print("Please enter again!")
        continue
    r = input("Do you want to enter another frequency band(Y/N)?")
    if r == "Y" or r == "y" or r == "":
        continue
    else:
        exit()
