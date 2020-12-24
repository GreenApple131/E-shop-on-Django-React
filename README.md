# E-shop-on-Django-React
Ecommerce site with Django and React

## Installation:
Use the 14.x version of node.

```bash
sudo apt-get install curl python-software-properties software-properties-common
curl -sL https://deb.nodesource.com/setup_14.x | sudo bash -
sudo apt-get install nodejs
```

## Inside venv:
```bash
pip install wheel (may be error, not critical)
python3 setup.py bdist_wheel
sudo apt install libpq-dev
pip install -r requirements.txt
npm install node-sass@4.14 --save
npm i
```

### Run Backend 
```bash
python3 manage.py makemigrations
python3 manage.py runserver
```

### Run Frontend part
```bash
npm start
```

### Additional
For DB Postgres, nginx, gunicorn this [LINK](https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu-18-04-ru) and some files inside project folder eshop/backup nginx-gunicorn. 
