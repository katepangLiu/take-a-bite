## SQL

### Types

#### SQLite Types

- TEXT
- NUMERIC
- INTEGER
- REAL
- BLOB
- ...



#### MySQL Types

- CHAR(size)
- VARCHAR(size)
- SMALLINT
- INT
- BIGINT
- FLOAT
- DOUBLE
- ...
- 

### Tables

#### CREATE TABLE

```sql
CREATE TABLE flights (
	id INTEGER PRIMARY KEY AUTOINCREMENT,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    duration INTEGER NOT NULL
)
```

#### Constraints

- CHECK
- DEFAULT
- NOT NULL
- PRIMARY
- UNIQUE
- ...

#### Insert

```sql
INSERT INTO flights
	(origin, destination, duration)
	VALUE ("New York", "Paris", 100)
```



### SQL Queries

#### SELECT

```sql
SELECT * FROM flight;
-- target column
SELECT origin, destination FROM flight ;
-- condition query
SELECT * FROM flight WHERE id = 3;
SELECT * FROM flight WHERE origin = "NEW York";
-- and condition
SELECT * FROM flight WHERE duration > 500 AND destination = "Paris";
-- or condition
SELECT * FROM flight WHERE duration > 500 OR destination = "Paris";
-- range query
SELECT * FROM flights WHERE origin IN ("New York", "Pairs")
-- Fuzzy query
SELECT * FROM flights WHERE origin LIKE "%a%";
```

#### Functions

- ARERAGE 
- COUNT
- MAX
- MIN
- SUM
- ...

#### UPDATE

```sql
UPDATE flights
	SET duration = 430
	WHERE origin = "New York"
	AND destination = "London"
```

#### DELETE

```sql
DELETE FORM flights WHERE id = 1
```

#### Other Clauses

- LIMIT
- ORDER BY
- GROUP BY
- HAVING
- ...

#### Joining Tables

##### Foreign Key

- airports(id, code, city)

- flights(id, origin_id, destination_id, duration)

- people(id, firstname, lastname)
- passengers( person_id , flight_id )

##### JOIN

```sql
SELECT first, origin, destination FROM flights JOIN passengers ON passengers.flight_id  = flights.id
```

- JOIN (INNER JOIN) 
- LEFT OUTER JOIN
- RIGHT OUTER JOIN
- FULL OUTER JOIN
- 

### CREATE INDEX

```sql
CREATE INDEX name_index ON passengers(lastname);
```

### SQL Injection

```sql
SELECT * FROM users WHERE username = "user" AND password = "passwd"

SELECT * FROM users WHERE username = "hacker"--" AND password = "";

SELECT * FROM users WHERE username = "hacker"
```

### Race Condition



## Models

### django models and migrations

- **define models**
  - models.py
    - `class Flight(models.Model)`
- **make migrations**
  - `python manage.py makemigrations`
- **apply migrations**
  - `python manage.py migrate`
    - applying flights.0001_initial
    - generate tables into dq.sqlite3
- **use models**
  - `shell`
    - `python manage.py shell`
  - code
- **modify models** 
  - rm -rf flights/migrate
  - rm -rf db.sqlite3
  - python manage.py makemigrations
  - python manage.py migrate --run-syncdb



edit models:

```python
from django.db import models

# Create your models here.
class Flight(models.Model):
    origin = models.CharField(max_length=64)
    destination = models.CharField(max_length=64)
    duration = models.IntegerField()
    
    def __str__():
        return f"{self.id}:{self.origin} to {self.duration}"
```

#### shell

python manage.py shell:

```python
from flights.models import Flight
f = Flight(origin="New York", destination="London", duration=415)
f.save()
Flight.objects.all()
```



```python
from flights.models import Flight
flights = Flight.objects.all()
flights
flight = flights.first()
flight
flight.id
flight.origin
flight.destination
 
flight.delete()
```



```python
from flights.models import Airport, Flight
jfk = Airport(code="JFK", city="New York")
jfk.save()
lhr = Airport(code="LHR", city="London")
lhr.save()
cdg = Airport(code="CDG", city="Paris")
cdg.save()
nrt = Airport(code="NRT", city="Tokyo")
nrt.save()
f = Flight(origin=jfk, destion=lhr, duration=415)
f.save()
```

```shell
>>> from flights.models import *
>>> Airport.objects.all()
<QuerySet [<Airport: New York (JFK)>, <Airport: London (LHR)>, <Airport: Paris (CDG)>, <Airport: Tokyo (NRT)>]>
>>> Airport.objects.filter(city="New York")
<QuerySet [<Airport: New York (JFK)>]>
>>> Airport.objects.filter(city="New York").first()
<Airport: New York (JFK)>
>>> Airport.objects.get(city="New York")
<Airport: New York (JFK)>
>>> jfk = Airport.objects.get(city="New York")
>>> cdg = Airport.objects.get(city="Paris")
>>> f = Flight(origin=jfk, destination=cdg, duration=435)
>>> f.save()
```

#### django Admin

- createsuperuser
  - `python manage.py createsuperuser`
- register models
  - edit admin.py



