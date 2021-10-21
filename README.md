# saymeciao 
A sample how to move your own application from your local computer to IBM Cloud, make it available to the world.

# A checklist to follow
Here are a 5 steps checklist to move your application to IBM Cloud

1) Understand the application architecture.
2) Build the Docker image
3) Push the docher image into a docker registry. 
4) Test locally ro run the image as Docke rcontainer on a kubernetes cluster.
5) Upload the docker container onto the kubernetes cluster in IBM CLOUD and verify the endpoint availability.


# The application architecture

Detect and check any eventual dependency.

Establish the way in which the application is launched.

In our sample the application is a simple server nodejs using some static pages.
We know that:

- we need to run npm install to load dependencies
- we use the command `node app.js` in mac or `nodejs app.js` in linux to start the application
- locally the address of the login page is http://localhost:3000
- writng a name and pressin login a message is displayed
- pressing log out the page is reset

# Costruire il contenitore Docker

Here is a dockrfile containing instructions to build the application image.

The image obviously depends on application architecture.

It installs the dependencies, copies application files, configure the environment and start the application

Build the image and test its way of working with following steps
```   
    docker build . -t fst/dimmiciao
    docker run -p 3020:3000 --name ciao ./dimmiciao
```
As expected the application appear at the adress`
```
    http://localhost:3020
```

# IBM Cloud Container Registry

IBM Cloud Container Registry is a private docker registry useful to store docker images to have them available when needed 
It is available also for free accounts, obviously for a limited number of images.

Inside the IBM Cloud Container Registry images can be divided and classified using namespaces.
In the free version only a namespace is available.
To store an image into the desired namespace we need to rename the image using the command `docker tag`
And then execute a command `docker push` as following


    ibmcloud login --apikey $AT_APIKEY_PUBLIC                       (Login to ibmcloud using your own apikey)
    ibmcloud cr login                                               (Login to IBM Cloud Container Registry)

    ibmcloud cr namespace-add myspace                               (Create your own namespace)

    docker tag fst/dimmiciao us.icr.io/myspace/dimmiciao:001        (Rename the container to store into registry)
    docker push us.icr.io/myspace/dimmiciao:001                     (Store the container)

    ibmcloud cr images                                              (Verify the image is available)
    
    
# Test the image locally using minikube

The correct working of our image containing our application can be tested locally using minikube as local cluster.
In this way we can quickly check that anything is working as expected
Minikube commands are:
    
    minikube start
    minikube status 
    minikube stop

Once minikube is started, it should be enabled to access our private registry where we stored the application image.

1) Store in the kubernetes cluster your credentials to access your private registry in the form of a PullSecret.
This task can be accomplished with following command:
```
kubectl --namespace <cluster-namespace>  create secret docker-registry <secret-name> --docker-server=<registry-endpoint> --docker-password=<ibmcloud apikey> --docker-username=iamapikey --docker-email=<your email>

as for instance
kubectl --namespace default  create secret docker-registry minikube-auditree-runner-us.icr.io --docker-server=us.icr.io --docker-password=N37ywUU2lXXXXXXXXXXXXXXXXXXX --docker-username=iamapikey --docker-email=fausto.ribechini@it.ibm.com
```

2) Create a kubernetes Service, configuring the access point of the application from external. 
   A standard file is here.


    kubectl create -f ./kubernates/dimmiciao-service.yml
   
    
3) Deploy the image into the cluster 

    
    kubectl create -f ./kubernetes/dimmiciao-deploy.yml

4) Verify it is working by mapping the port of the application to a different port number.
   
    kubectl port-forward dimmiciao-69bd84845c-mj8sk 3030:3000``
    
Ìn this way the aplication is available on your computer to the adress http://localhost:3030

# Caricamento su IBM CLOUD

Àll the steps previously performed and verified on Minikube cluster can be repeated on IBM CLOUD cluster
Thus start creating a cluster in IBM Cloud

Then configuring our ibmcloud cli interface to work with that cluster:

    ibmcloud ks clusters
    ibmcloud ks cluster config --cluster <cluster>

At this point you can repeat same commands as you run for Minikube

- Create a secret:           `kubectl --namespace <cluster-namespace>  create secret docker-registry <secret-name> --docker-server=<registry-endpoint> --docker-password=<ibmcloud apikey> --docker-username=iamapikey --docker-email=<your email>`

- Create service:            `kubectl create -f ./kubernates/dimmiciao-service.yaml`

- Create deploy:             `kubectl create -f ./kubernetes/dimmiciao-deploy.yaml`

Now you can determine the public ip available for cluster worker nodes by command 
        
        ibmcloud ks workers --cluster <cluster>

and the service port number by service configuration
        
        kubectl get service dimmiciao-service

Your application is now available at address `http://public_ip:port` and can be reached by everyone in the world.

