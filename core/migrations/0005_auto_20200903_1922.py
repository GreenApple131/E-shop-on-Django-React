# Generated by Django 2.2.12 on 2020-09-03 19:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_itemvariation_variation'),
    ]

    operations = [
        migrations.AlterField(
            model_name='itemvariation',
            name='attachment',
            field=models.ImageField(blank=True, upload_to=''),
        ),
    ]
