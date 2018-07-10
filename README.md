# dimmiciao 
Come portare una propria applicazione dal proprio computer ad IBM CLOUD, rendendola disponibile al mondo

# Una checklist da seguire
in 5 punti i passi per portare la propira applicazione su IBM CLOUD

1) Conoscere la struttura dell’applicazione
2) Costruire il contenitore Docker
3) Immagazzinare l’immagine del contenitore in un registro Docker 
4) Provare in ambito locale il caricamento del contenitore Docker  su un cluster kubernetes
5) Caricare il contenitore sul cluster kubernetes IBM CLOUD e verificare la sua disponibilità


# La struttura dell'applicazione

Osservare se ci sono e quali sono le dipendenze
Individuare se devono essere eseguiti dei passi di configurazione
Determinare il modo in cui l’applicazione viene lanciata

Nel nostro esempio l'applicazione e' un semplice server nodejs con alcune pagine statiche
Sappiamo che:
    - dobbiamo girare npm install per caricare le dipendenze
    - per lanciarla dobbiamo eseguire il comnado node app.js se in mac o nodejs app.js se in liunx
    - una volta lanciata, aprendo un browser ed eseguendo http://localhost:3000 si vedra la pagina di login
    - se scrive un nome e si preme login apparira' il messaggio di saluto
    - premendo log out si tornera' alla situazione iniziale.

# Costruire il contenitore Docker

Viene qua fornito un dockerfile che contiene le istruzioni per la creazione del contenitore. 
Questo dipende dalla struttura dell’applicazione
Installa dipendenze
Copia i file dell’applicazione
Esegue configurazioni
Esegue il comando di partenza dell’applicazione
Creato il dockerfile si costruisce il contenitore e se ne testa il funzionamento

Ecco i passi per la creazione e l'esecuzione del dockerfile:
    
    docker build . -t fst/dimmiciao
    docker run -p 3020:3000 --name ciao ./dimmiciao
    
A questo punto l'applicazione si troverà alla nuova pagina 
    
    http://localhost:3020

# Il registro docker

Il Docker registry e’ un repository per rendere od avere disponibili i contenitori creati
Ci sono diversi tipi di Docker Registry. IBM CLOUD ne ha uno al suo interno
Disponibile anche per i free accounts di prova
Può suddividere i contenitori classificandoli sotto nomi diversi (namespaces)
Operativamente basta nominare l’immagine del contenitore in modo opportuno
Ed eseguire il comando di trasferimeneto (push)

Di seguito i comando per immagazzinare il contenitore nel registro docker

    bx login -a https://api.ng.bluemix.net -u <username> -p xxxx    (Eseguire il login ad IBM CLOUD con il proprio utente IBM)
    bx cr login                                                     (Eseguire il login al conatiner registry)

    bx cr namespace-add myspace                                     (creare un propio namespace)

    docker build . -t registry.ng.bluemix.net/myspace/dimmiciao:001 (creare un contenitore con nome già predisposto per il registro)
    docker push registry.ng.bluemix.net/ribe/dimmiciao:001          (immagazzinare il container con il comando push)

    bx cr images                                                    (verificare il contenitore sia presente tra i contenitori disponibili)
    
    
# Test di installazione su cluster kubernetes sul proprio computer

Le operazioni elencate possono essere provate e testate su un cluster locale, prima di passare a IBM Cloud
Minikube è lo strumento per I test in locale
Più veloce ed previene danni per operazioni non volute
Una volta installato i comandi sono :
    
    minikube start
    minikube status 
    minikube stop

Una volta verificata la corretta partenza di minikube abbiamo bisogno di accedere al docker registry dove abbiamo inserito il nostro 
contenitore.
1) Creare una credenziale in kubernetes per poter accedere al Docker registry (secret)
Istruzioni a https://console.bluemix.net/docs/containers/cs_dedicated_tokens.html
Chiedere Token per eseguire l’operazione relativo al proprio utente IBM CLOUD
Individuare la propria organizzazione
Con organizzazione e token autorizzazione chiedere il token password per accedere al Docker Registry
Ottenuto il token password si puo' costruire il secret kubernetes che agirà come credenziale per il recupero del contenitore
    kubectl create secret docker-registry dimmisecret --docker-server=https://registry.ng.bluemix.net --docker-username=token --docker-password=< token password> --docker-email=<user-email del login IBMCLOUD>


2) Creare un Servizio kubernetes che rappresenta il punto di ingresso all’applicazione dall’esterno. Il file e' contenuto in questo repository
    kubectl create -f ./kubernates/dimmiciao-service.yml
3) Caricare il contenitore all’interno del cluster  
    kubectl create -f ./kubernetes/dimmiciao-deploy.yml
4) verificarne il funzionamento (port forward)
    kubectl port-forward dimmiciao-69bd84845c-mj8sk 3030:3000
A questo punto l'applicazione sarà disponibile sul vostro computer all'indirizzo http://localhost:3030

# Caricamento su IBM CLOUD

Le operazioni testate e verificate su Minikube possono ripetersi sul cluster IBM CLOUD
Deve essere creato un cluster con una utenza abilitata a farlo.
Poi si connette il cluster:
    
    bx cs clusters
    bx cs cluster-config <cluster>
    
    il comando riporterà una variabile da settare nell'ambiente per connettere il cluster
    export KUBECONFIG=/Users/<name>/.bluemix/plugins/container-service/clusters/<cluster>/kube-config-<cluster>.yml

A questo punto si possono ripetere i comandi già testati in Minikube

Creazione secret            kubectl create secret docker-registry dimmisecret --docker-server=https://registry.ng.bluemix.net --docker-username=token --docker-password=< token password> --docker-email=<user-email del login IBMCLOUD>

Creazione service           kubectl create -f ./kubernates/dimmiciao-service.yml

Creazione deploy            kubectl create -f ./kubernetes/dimmiciao-deploy.yml

Allora si può individuare l’ip pubblico disponibile per i nodi del cluster
        
        bx cs workers <cluster>

Individuazione della porta dal servizio
        
        kubectl get service dimmiciao-service

Lanciando  http://ip_pubblico:porta si arriva all’applicazione che ora e' disponibile in tutto il mondo a quell'indirizzo

