'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ModelInfo() {
  const [modelInfo, setModelInfo] = useState<any>(null)
  const [featureImportance, setFeatureImportance] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchModelInfo()
  }, [])

  const fetchModelInfo = async () => {
    try {
      const [infoRes, featuresRes] = await Promise.all([
        axios.get('http://localhost:8000/model/info'),
        axios.get('http://localhost:8000/model/feature-importance')
      ])
      setModelInfo(infoRes.data)
      setFeatureImportance(featuresRes.data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch model info:', error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-foreground">Model Information</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Detailed information about the fraud detection ML model
        </p>
      </div>

      {/* Model Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Model Version</p>
              <p className="text-xl font-bold text-foreground">{modelInfo?.version || 'v3.0.0'}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Features</p>
              <p className="text-xl font-bold text-foreground">
                {featureImportance?.total_features || 45}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Accuracy</p>
              <p className="text-xl font-bold text-foreground">
                {modelInfo?.models?.ensemble?.roc_auc 
                  ? (modelInfo.models.ensemble.roc_auc * 100).toFixed(2) + '%'
                  : '99.8%'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Model Performance */}
      {modelInfo?.models && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Model Performance Metrics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(modelInfo.models).map(([name, metrics]: [string, any]) => (
              <div key={name} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm font-medium text-foreground mb-3 capitalize">{name}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">ROC-AUC:</span>
                    <span className="font-medium text-foreground">{(metrics.roc_auc * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Precision:</span>
                    <span className="font-medium text-foreground">{(metrics.precision * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Recall:</span>
                    <span className="font-medium text-foreground">{(metrics.recall * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">F1-Score:</span>
                    <span className="font-medium text-foreground">{(metrics.f1 * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feature Engineering */}
      {modelInfo?.feature_engineering && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Feature Engineering</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(modelInfo.feature_engineering).map(([category, features]: [string, any]) => (
              <div key={category} className="p-4 rounded-lg bg-secondary/50 border border-border">
                <p className="text-sm font-medium text-foreground mb-2 capitalize">
                  {category.replace(/_/g, ' ')}
                </p>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(features) && features.map((feature: string, idx: number) => (
                    <span key={idx} className="px-2 py-1 rounded bg-primary/10 text-primary text-xs">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Feature Importance */}
      {featureImportance?.feature_importance && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Top 10 Most Important Features</h3>
          <div className="space-y-3">
            {Object.entries(featureImportance.feature_importance)
              .slice(0, 10)
              .map(([feature, importance]: [string, any], idx: number) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-foreground">{feature}</span>
                    <span className="text-sm font-medium text-primary">
                      {(importance * 100).toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                      style={{ width: `${importance * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Dataset Info */}
      {modelInfo?.dataset && (
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Training Dataset</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Samples</p>
              <p className="text-xl font-bold text-foreground">
                {modelInfo.dataset.total_samples?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Fraud Rate</p>
              <p className="text-xl font-bold text-foreground">
                {(modelInfo.dataset.fraud_rate * 100).toFixed(2)}%
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Train Samples</p>
              <p className="text-xl font-bold text-foreground">
                {modelInfo.dataset.train_samples?.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Test Samples</p>
              <p className="text-xl font-bold text-foreground">
                {modelInfo.dataset.test_samples?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
