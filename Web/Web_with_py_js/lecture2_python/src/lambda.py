people = [
    {"name": "kate", "house":"house1"},
    {"name": "pang", "house":"house2"},
    {"name": "micky", "house":"house3"}
]

def name(person):
    return person["name"]

#people.sort(key=name)
people.sort(key= lambda person: person["name"])
print(people)