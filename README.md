# Tracking CTA Example


You can find this project under this https://codesandbox.io/p/github/arnoldmanuel/ab-challenge/draft/red-fire?file=%2F.codesandbox%2Ftasks.json%3A7%2C7&workspaceId=231a474d-64b5-41b2-97b6-2d78e0af9e4c.


#### Build this project and run it locally


```sh
npm install
```


After you have installed all dependecies you can run the application in two steps:


```sh
npx prisma generate
```
and then
```sh
npm run dev
```


# Solution and Thoughts


## Why using Remix.run instead of pure html with JavaScript?


In the past I mostly worked with bare bones react applications using react router dom or using Next.js as a framework.
I've wanted to try out Remix.run for a long time now. I have touched it a bit and reading through the challenge I thought this could be a good opportunity to learn something new on the way.


## How can I add a Variant?


You can simply visit /admin where you can add a new variant and also can see the CTA for the two Variants. Keep in mind the admin page would need some change to showcase more than two variants. But since this is a simple A/B experiment, usually you would want only option A (status_quo) and option B (treatment) to have a good analysis about the improvement.


## The Solution


I am using a mix of database columns and http only cookies to keep things simple. I will briefly explain how my current solution is working and after that I will explain what we should / can improve to make this better with more time.


When a user visits the site we first check if the user already has a cookie called cohort, this cookie basically helps us to understand if the user is already cohorted into a specific experiment / variant. If the user has this cookie we return the variant for it. If not we create this cookie and attach a random variant to it. This is technically happening on the server.


On the client we receive this value, please keep in mind that only specific color tokens are possible for the variants. You can find them below. As soon as the page loads we also track a page view. For this event we simply call the /track-page-view endpoint and create a new entry in the db.


Keep in mind we don't track unique page views, we basically track the total page views.


Why?


We could for sure track unique page views by adding a cookie and a new column, but I believe it's better right now to track the total page views since every page view is a chance of conversion and we should track that number definitely. If we would like to track the unique page view we could add this separately.


The user clicks sign up, what happens?


We track the click on the sign up button and basically insert a new event into the db, since we want to keep them unique we have a unique column which gets set to true the first time. After that we set a cookie, which we can then reference in further click events to understand if it is a user click we already registered or if it is a unique one.


## What I would improve?


1. Currently we use cookies, the cookie values are easy to change and that way we could mess with the Analytics. It would potentially be better to use a cookie secret which can be done quite easily with Remix. Another possibility to track would be JWT.
2. The Admin Dashboard would need more flexibility for being able to add more than two variants for example.
3. With the current solution we need cookie consent, which might be a bad idea, we could also do anonymous tracking.