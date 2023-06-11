#!/bin/sh

################################################################################
# Prepare minikube
################################################################################

minikube stop
minikube delete
minikube start
minikube image load ink-playground-kubernetes:latest

################################################################################
# Apply kubernetes rules
################################################################################

minikube kubectl -- apply -f serviceaccount.yaml
minikube kubectl -- apply -f clusterrolebinding.yaml
minikube kubectl -- apply -f pod.yaml
minikube kubectl -- apply -f service.yaml

################################################################################
# Show setup
################################################################################

minikube kubectl -- get pods -A
nmap $(minikube ip)
