'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function DriveTestPage() {
  const [testing, setTesting] = useState(false)
  const [result, setResult] = useState<any>(null)

  const testDrive = async () => {
    setTesting(true)
    setResult(null)

    try {
      const res = await fetch('/api/test-drive')
      const data = await res.json()
      setResult(data)
    } catch (error) {
      setResult({ error: 'Failed to test', details: error })
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">🔍 Google Drive Test</h1>
        <p className="mt-2 text-gray-600">
          Test koneksi ke Google Drive untuk upload foto produk
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Test Drive Access</h2>
          <p className="text-sm text-gray-600 mb-4">
            Klik tombol dibawah untuk cek apakah OAuth scope sudah benar dan Drive API bisa diakses.
          </p>
          <Button onClick={testDrive} disabled={testing}>
            {testing ? 'Testing...' : '🧪 Test Drive Access'}
          </Button>
        </div>

        {result && (
          <div>
            <h3 className="text-md font-semibold mb-3">Test Result:</h3>
            
            {result.success ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg font-bold">✅ Drive Access Working!</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>OAuth Scope:</strong>
                    <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-x-auto">
                      {result.scope}
                    </pre>
                  </div>
                  <div className="flex items-center gap-2">
                    <strong>Has Drive Scope:</strong>
                    <span className={result.hasDriveScope ? 'text-green-600' : 'text-red-600'}>
                      {result.hasDriveScope ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <strong>Can Access Drive:</strong>
                    <span className="text-green-600">✅ Yes</span>
                  </div>
                  {result.testResult && result.testResult.length > 0 && (
                    <div>
                      <strong>Sample Files Found:</strong>
                      <pre className="mt-1 bg-white p-2 rounded border text-xs">
                        {JSON.stringify(result.testResult, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
                <div className="mt-4 p-3 bg-green-100 rounded">
                  <p className="text-sm text-green-800">
                    <strong>✅ Everything looks good!</strong><br/>
                    OAuth scope sudah benar dan Drive API bisa diakses.<br/>
                    Kalau upload foto masih gagal, cek Vercel logs untuk error details.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800 mb-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span className="text-lg font-bold">❌ Drive Access Failed</span>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 bg-white p-2 rounded border text-xs text-red-600">
                      {result.error}
                    </pre>
                  </div>
                  {result.message && (
                    <div>
                      <strong>Message:</strong>
                      <pre className="mt-1 bg-white p-2 rounded border text-xs">
                        {result.message}
                      </pre>
                    </div>
                  )}
                  {result.currentScope && (
                    <div>
                      <strong>Current Scope:</strong>
                      <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-x-auto">
                        {result.currentScope}
                      </pre>
                    </div>
                  )}
                  {result.requiredScope && (
                    <div>
                      <strong>Required Scope:</strong>
                      <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-x-auto">
                        {result.requiredScope}
                      </pre>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 p-3 bg-red-100 rounded">
                  <p className="text-sm text-red-800 font-semibold mb-2">🔧 How to Fix:</p>
                  {result.error === 'Missing Drive scope' ? (
                    <ol className="list-decimal list-inside space-y-1 text-sm text-red-800">
                      <li>OAuth scope tidak include drive.file</li>
                      <li><strong>MUST LOGOUT</strong> dari aplikasi</li>
                      <li><strong>LOGIN AGAIN</strong> untuk get new token</li>
                      <li>Google akan ask permission lagi</li>
                      <li>Approve Drive access</li>
                      <li>Test lagi!</li>
                    </ol>
                  ) : result.error === 'No access token' || result.error === 'No Google account found' ? (
                    <ol className="list-decimal list-inside space-y-1 text-sm text-red-800">
                      <li><strong>LOGOUT</strong> dari aplikasi</li>
                      <li><strong>LOGIN AGAIN</strong> dengan Google</li>
                      <li>Test lagi!</li>
                    </ol>
                  ) : (
                    <p className="text-sm text-red-800">
                      Cek Google Cloud Console → APIs & Services → Credentials<br/>
                      Pastikan Drive API enabled dan OAuth scope sudah benar.
                    </p>
                  )}
                </div>
              </div>
            )}

            <details className="mt-4">
              <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-900">
                📋 Full Response (Click to expand)
              </summary>
              <pre className="mt-2 bg-gray-50 p-4 rounded border text-xs overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </details>
          </div>
        )}

        <div className="border-t pt-6">
          <h3 className="text-md font-semibold mb-3">📚 Troubleshooting Guide</h3>
          <div className="space-y-4 text-sm">
            <div>
              <strong className="text-purple-600">1. Missing Drive Scope</strong>
              <p className="text-gray-600 mt-1">
                Jika error "Missing Drive scope", berarti OAuth token lama tidak punya permission Drive.
                <strong> MUST logout & login again</strong> untuk get new token dengan Drive access.
              </p>
            </div>
            
            <div>
              <strong className="text-purple-600">2. No Access Token</strong>
              <p className="text-gray-600 mt-1">
                Token expired atau tidak ada. <strong>Logout & login again.</strong>
              </p>
            </div>
            
            <div>
              <strong className="text-purple-600">3. Drive API Not Enabled</strong>
              <p className="text-gray-600 mt-1">
                Check Google Cloud Console → Enable Google Drive API
              </p>
            </div>

            <div>
              <strong className="text-purple-600">4. Upload Succeeds but Images Not in Folder</strong>
              <p className="text-gray-600 mt-1">
                Check folder ID di .env: <code className="bg-gray-100 px-1 rounded">DRIVE_ROOT_FOLDER_ID</code><br/>
                Images might be in different folder or Drive root.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Quick Fix Steps:</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Click "Test Drive Access" button above</li>
            <li>If error shows → Follow the fix instructions</li>
            <li>Usually: <strong>Logout → Login → Test again</strong></li>
            <li>If still fails → Share error message with developer</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
