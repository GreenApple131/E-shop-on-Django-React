# Generated by Django 2.2.12 on 2020-11-26 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0029_auto_20201126_1634'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='category',
            field=models.CharField(choices=[('Co', 'Coats'), ('Ja', 'Jackets'), ('S', 'Shirts'), ('Ts', 'T-shirts'), ('Sw', 'Sport wear'), ('Sh', 'Shoes'), ('Hat', 'Hats'), ('Ow', 'Outwear')], max_length=3),
        ),
    ]