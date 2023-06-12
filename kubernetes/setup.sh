#!/bin/sh

################################################################################
# Prepare minikube
################################################################################

minikube stop
minikube delete
minikube start
minikube image load ink-playground-kubernetes:latest
minikube image load ink-compiler:latest

################################################################################
# Apply kubernetes rules
################################################################################

minikube kubectl -- apply -f clusterrole.yaml
minikube kubectl -- apply -f clusterrolebinding.yaml
minikube kubectl -- apply -f serviceaccount.yaml
minikube kubectl -- apply -f service.yaml
minikube kubectl -- apply -f deployment.yaml

################################################################################
# Show setup
################################################################################

minikube kubectl -- get pods -A
nmap $(minikube ip)
