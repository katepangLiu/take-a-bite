from django.shortcuts import render

# Create your views here.
from .models import Flight

def index(request):
    return render(request, "flights/index.html", {
        "flights": Flight.objects.all()
    })

def flight(request, id):
    try:
        flight = Flight.objects.get(pk=id)
        return render(request, "flights/flight.html", {
        "flight": flight,
        "passengers": flight.passengers.all()
    })

    except Flight.DoesNotExist:
        return render(request, "flights/flightUnknown.html")