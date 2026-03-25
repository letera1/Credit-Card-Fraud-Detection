# Deployment Guide

## Deployment Options

### 1. Docker Deployment

#### Build Image
```bash
docker build -t fraud-detection:latest .
```

#### Run Container
```bash
docker run -d \
  -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  -v $(pwd)/logs:/app/logs \
  --name fraud-detection-api \
  fraud-detection:latest
```

#### Using Docker Compose
```bash
docker-compose up -d
```

### 2. Kubernetes Deployment

Create deployment manifest:
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: fraud-detection
spec:
  replicas: 3
  selector:
    matchLabels:
      app: fraud-detection
  template:
    metadata:
      labels:
        app: fraud-detection
    spec:
      containers:
      - name: api
        image: fraud-detection:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

### 3. Cloud Deployment

#### AWS (ECS/Fargate)
1. Push image to ECR
2. Create ECS task definition
3. Deploy to Fargate

#### GCP (Cloud Run)
```bash
gcloud run deploy fraud-detection \
  --image gcr.io/PROJECT_ID/fraud-detection \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

#### Azure (Container Instances)
```bash
az container create \
  --resource-group myResourceGroup \
  --name fraud-detection \
  --image fraud-detection:latest \
  --dns-name-label fraud-detection \
  --ports 8000
```

## Production Checklist

- [ ] Environment variables configured
- [ ] Logging configured
- [ ] Monitoring setup (Prometheus/Grafana)
- [ ] Load balancer configured
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting enabled
- [ ] Authentication/Authorization implemented
- [ ] Backup strategy defined
- [ ] Disaster recovery plan
- [ ] Performance testing completed
- [ ] Security audit completed

## Monitoring

### Metrics to Track
- Request latency
- Throughput (requests/second)
- Error rate
- Model prediction distribution
- Resource utilization (CPU, Memory)

### Logging
Logs are stored in `/logs` directory with daily rotation.

### Health Checks
- Liveness: `GET /health`
- Readiness: `GET /`

## Scaling

### Horizontal Scaling
Increase number of replicas based on load:
```bash
kubectl scale deployment fraud-detection --replicas=5
```

### Auto-scaling
Configure HPA (Horizontal Pod Autoscaler):
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: fraud-detection-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: fraud-detection
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

## Security

### Best Practices
1. Use secrets management (AWS Secrets Manager, HashiCorp Vault)
2. Enable HTTPS only
3. Implement rate limiting
4. Add authentication (API keys, OAuth)
5. Regular security updates
6. Network policies
7. Input validation
8. Audit logging
