    <meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1"/>
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <!-- keywords -->
    <meta name="keywords" content="{{ page_keywords(true) }}"/>
    <!-- Canonical links -->
    <link rel="canonical" href="{{ url }}">
    <!-- CSS -->
    <!-- build:css css/dist.o2.css -->
    {{ css('css/style') }}
    <!-- endbuild -->
    <!-- RSS -->
    {{ feed_tag('atom.xml') }}
    <script>
        var App = {
            root:'{{ config.root }}'    
        };
    </script>