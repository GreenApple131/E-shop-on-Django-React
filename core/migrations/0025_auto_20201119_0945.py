# Generated by Django 2.2.12 on 2020-11-19 09:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0024_auto_20201006_1927'),
    ]

    operations = [
        migrations.CreateModel(
            name='OtherMarks',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('mark', models.CharField(default='ordinary', max_length=100)),
            ],
        ),
        migrations.AddField(
            model_name='item',
            name='other_marks',
            field=models.ManyToManyField(to='core.OtherMarks'),
        ),
    ]
