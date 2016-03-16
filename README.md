This is an unfinished project that I am currently working on.  It is going to be a Shopify app where Shopify store owners will submit their products to be discounted and featured on a deal site that I'm going to create along with this app.  On the deal site, the deals will link to the store owners shop and I will take a small percentage of any orders that are referred by the deal site.

Here's what I have done so far:

* Partial completion of the Shopify App front end using React.js and Bootstrap.

* Nginx web server running on a Digital Ocean droplet to serve as a load balancer.

* Distributed Express.js app running on a Digital Ocean droplet with ability to scale horizontally that handles: Oauth authentication with Shopify, HTTP requests from the       Shopify app frontend, webhooks from shopify, usage of the Shopify API, communication with Stripe for payments, and CRUD operations on a distributed OrientDB document graph database.
