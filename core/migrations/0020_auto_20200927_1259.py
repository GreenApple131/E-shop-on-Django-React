# Generated by Django 2.2.12 on 2020-09-27 12:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0019_auto_20200927_1245'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='item',
            options={},
        ),
        migrations.RemoveIndex(
            model_name='item',
            name='core_item_title_5d1ed3_idx',
        ),
    ]