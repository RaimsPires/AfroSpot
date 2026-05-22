from django.shortcuts import render

def verify_email_page(request):
    # Extract the key from the URL query parameters
    key = request.GET.get('key', '')
    
    context = {
        'key': key
    }
    return render(request, 'auth/verify_email.html', context)