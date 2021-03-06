# Generated by Django 2.2.12 on 2020-09-04 12:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_auto_20200904_1207'),
    ]

    operations = [
        migrations.AddField(
            model_name='item',
            name='category_type',
            field=models.CharField(choices=[('M', 'Men'), ('W', 'Women')], default='M', max_length=1),
        ),
        migrations.AlterField(
            model_name='item',
            name='category',
            field=models.CharField(choices=[('Co', 'Coats'), ('Ja', 'Jackets'), ('S', 'Shirts'), ('Ts', 'T-shirts'), ('Sw', 'Sport wear'), ('Sh', 'Shoes'), ('Hat', 'Hats'), ('Ow', 'Outwear')], max_length=3),
        ),
    ]
