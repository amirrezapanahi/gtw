# gtw

Run the following to login in to the registry:

```heroku container:login```

Run this command to build your Docker image and push it to Heroku:

```heroku container:push web --app [YOUR_APP_NAME]```

Notice that we specify web, this indicates the process type we want to associate with this application. Further reading on process types can be found here.

And finally, run this to release the image to your application:

```heroku container:release web --app [YOUR_APP_NAME]```

We should now be able to navigate to our application hosted on Heroku by running:

heroku open --app [YOUR_APP_NAME]