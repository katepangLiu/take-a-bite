# Lecture3 Django

## HTTP

```shell
#request
GET / HTTP/1.1
Host: www.example.com
...

#response
HTTP/1.1 200 OK
Content-Type: text/html
...
```

HTTP Status Codes

- 200
- 301
- 403
- 404
- 500
- ...



## Django

### env

```shell
pip install django
     or
pip3 install django
```



### start project demo

```
django-admin startproject demo
cd demo
python manage.py runserver
```

### project architecture

- project
  - main app
  - sub apps
    - app1
    - app2
    - app3

### add an app hello

- `python manage.py startapp hello`

- add app into demo/setting.py

- add route 

- add app logic


### html template

django will generate the final html with conditions

template:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Is it New Year's?</title>
    </head>
    <body>
        {% if isNewyear %}
            <h1>Yes.</h1>
        {% else %}
            <h1>No.</h1>
        {% endif %}
    </body>

</html>
```

final html:

```html
<!DOCTYPE html>
<html lang="en">
    <head>
        <title>Is it New Year's?</title>
    </head>
    <body>
        
            <h1>No.</h1>
        
    </body>

</html>
```

