# Generated by Django 2.2.12 on 2020-10-06 19:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0022_auto_20200927_1312'),
    ]

    operations = [
        migrations.AlterField(
            model_name='item',
            name='category_type',
            field=models.CharField(choices=[('Men', 'Men'), ('Women', 'Women')], max_length=1),
        ),
    ]
