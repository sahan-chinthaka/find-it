"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, CheckCircle2, Zap } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <div className="page-wrap space-y-12 py-12">
      {/* Hero Section */}
      <section className="mx-auto max-w-4xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">How It Works</p>
        <h1 className="mt-3 text-5xl font-bold text-slate-900">AI-Powered Lost & Found Matching</h1>
        <p className="mt-4 text-lg text-slate-600">
          FindIt uses artificial intelligence and location data to match lost and found items with remarkable accuracy.
        </p>
      </section>

      <Tabs defaultValue="overview" className="mx-auto w-full max-w-5xl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="algorithm">Algorithm</TabsTrigger>
          <TabsTrigger value="workflow">Workflows</TabsTrigger>
          <TabsTrigger value="example">Example</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="glass-card border-emerald-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-emerald-600" />
                What is FindIt?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                <strong>FindIt</strong> is an AI-powered lost-and-found service that intelligently matches lost items with found
                items using:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Badge variant="outline" className="shrink-0 border-emerald-300 bg-emerald-50">
                    🤖
                  </Badge>
                  <span>
                    <strong>Google Gemini AI:</strong> Analyzes item descriptions, images, and text to extract meaningful keywords
                  </span>
                </li>
                <li className="flex gap-3">
                  <Badge variant="outline" className="shrink-0 border-emerald-300 bg-emerald-50">
                    🔑
                  </Badge>
                  <span>
                    <strong>Keyword Matching:</strong> Compares extracted keywords to find semantic similarities
                  </span>
                </li>
                <li className="flex gap-3">
                  <Badge variant="outline" className="shrink-0 border-emerald-300 bg-emerald-50">
                    📍
                  </Badge>
                  <span>
                    <strong>Location Matching:</strong> Uses GPS coordinates to find items within 10km of each other
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">For People Who Found Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      1
                    </span>
                    <span>Report the found item with photo and details</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      2
                    </span>
                    <span>AI extracts keywords from the description and image</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      3
                    </span>
                    <span>System finds matching lost items automatically</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                      4
                    </span>
                    <span>Review suggestions and send match requests</span>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">For People Who Lost Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <ol className="space-y-2 text-sm">
                  <li className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                      1
                    </span>
                    <span>Report the lost item with photo and details</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                      2
                    </span>
                    <span>AI extracts keywords from the description and image</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                      3
                    </span>
                    <span>System finds matching found items automatically</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                      4
                    </span>
                    <span>Review suggestions and coordinate item return</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ALGORITHM TAB */}
        <TabsContent value="algorithm" className="space-y-6">
          <Card className="glass-card border-blue-200/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                The Matching Algorithm (3-Phase Process)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Phase 1 */}
              <div className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">AI Keyword Extraction (Google Gemini)</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      When you report an item, we send the image, title, and description to Google's Gemini AI.
                    </p>
                    <div className="mt-3 space-y-2 rounded bg-white p-3 text-sm">
                      <p>
                        <strong className="text-blue-700">AI Analyzes:</strong>
                      </p>
                      <ul className="ml-4 space-y-1 list-disc text-slate-600">
                        <li>Item descriptions and features</li>
                        <li>Image content and visual features</li>
                        <li>Brands, colors, serial numbers</li>
                        <li>Any text visible in images</li>
                      </ul>
                      <p className="mt-2">
                        <strong className="text-blue-700">Output:</strong> Up to 10 keywords (e.g., "Sony", "headphones", "red",
                        "wireless")
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Keyword-Based Matching</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      We search the database for items with similar keywords and calculate a similarity score.
                    </p>
                    <div className="mt-3 space-y-2 rounded bg-white p-3 text-sm">
                      <p>
                        <strong className="text-blue-700">Matching Score Formula:</strong>
                      </p>
                      <div className="ml-4 space-y-1 font-mono text-xs text-slate-700">
                        <p>Score = (Matching Keywords / Total Keywords) + Location Bonus</p>
                      </div>
                      <p className="mt-2">
                        <strong className="text-blue-700">Example:</strong> If your item has 6 keywords and 3 match → 3÷6 = 50%
                        score
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="space-y-3 rounded-lg border border-blue-100 bg-blue-50/40 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900">Location Bonus & Filtering</h4>
                    <p className="mt-1 text-sm text-slate-600">
                      We boost scores for items found nearby and filter for the best matches.
                    </p>
                    <div className="mt-3 space-y-2 rounded bg-white p-3 text-sm">
                      <p>
                        <strong className="text-blue-700">Location Bonus:</strong> +20% if items are within 10km of each other
                      </p>
                      <p className="mt-1">
                        <strong className="text-blue-700">Quality Threshold:</strong> Only show matches with score above 40%
                      </p>
                      <p className="mt-1">
                        <strong className="text-blue-700">Top Results:</strong> Display top 5 matches, sorted by score
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                <p className="text-sm">
                  <strong className="text-emerald-700">💡 Result:</strong> You see the most relevant and geographically closest
                  matches at the top of your suggestions list.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WORKFLOW TAB */}
        <TabsContent value="workflow" className="space-y-6">
          <Card className="glass-card border-purple-200/50">
            <CardHeader>
              <CardTitle>Full User Journey</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h4 className="mb-4 text-sm font-bold text-slate-900">Step 1: Report an Item</h4>
                <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                      📸
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Upload Photos</p>
                      <p className="text-sm text-slate-600">Take clear photos of the item from different angles</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                      ✍️
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Describe the Item</p>
                      <p className="text-sm text-slate-600">Include color, brand, size, distinguishing features</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                      📍
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Mark Location</p>
                      <p className="text-sm text-slate-600">Drop a pin on the map where you found/lost the item</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-bold text-slate-900">Step 2: AI Processing</h4>
                <div className="space-y-2 rounded-lg bg-slate-50 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">Image is analyzed by Gemini AI</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">Keywords are extracted and stored</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">Database is searched for matches</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    <span className="text-sm">Top 5 matches are created automatically</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-bold text-slate-900">Step 3: Review Suggestions</h4>
                <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">You'll see up to 5 suggested matches. For each match, you can:</p>
                  <div className="mt-2 space-y-2">
                    <div className="flex gap-2">
                      <Badge className="shrink-0 bg-emerald-100 text-emerald-700">✓</Badge>
                      <span className="text-sm">
                        <strong>Accept:</strong> This could be a match, send a request
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Badge className="shrink-0 bg-red-100 text-red-700">✗</Badge>
                      <span className="text-sm">
                        <strong>Mark as Wrong:</strong> This isn't a match, don't show again
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-sm font-bold text-slate-900">Step 4: Coordinate & Connect</h4>
                <div className="space-y-2 rounded-lg bg-slate-50 p-4">
                  <p className="text-sm text-slate-600">Once both parties agree it's a match:</p>
                  <ul className="mt-2 space-y-1 text-sm list-disc list-inside text-slate-600">
                    <li>Exchange contact information</li>
                    <li>Arrange time and location for handoff</li>
                    <li>Complete the transaction</li>
                    <li>Mark the match as "Done"</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* EXAMPLE TAB */}
        <TabsContent value="example" className="space-y-6">
          <Card className="glass-card border-orange-200/50">
            <CardHeader>
              <CardTitle>Real Example: Sony Headphones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg border border-orange-100 bg-orange-50/40 p-4">
                <h4 className="font-bold text-slate-900">📱 Scenario</h4>
                <p className="mt-2 text-sm text-slate-600">
                  Sarah finds a pair of red Sony WH-1000XM4 headphones at the park and reports it on FindIt.
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h5 className="font-bold text-slate-900">Step 1: AI Keyword Extraction</h5>
                  <div className="mt-3 bg-slate-50 p-3 rounded">
                    <p className="text-xs font-semibold text-slate-600 mb-2">EXTRACTED KEYWORDS:</p>
                    <div className="flex flex-wrap gap-2">
                      {["Sony", "headphones", "red", "WH-1000XM4", "wireless", "noise-canceling", "earphones", "audio"].map(
                        (kw) => (
                          <Badge key={kw} variant="outline" className="border-slate-300 bg-slate-100">
                            {kw}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h5 className="font-bold text-slate-900">Step 2: Database Search</h5>
                  <p className="mt-2 text-sm text-slate-600">System finds 3 items with matching keywords:</p>
                  <div className="mt-3 space-y-3">
                    {[
                      {
                        name: "Red Sony Headphones Lost",
                        keywords: ["Sony", "headphones", "red"],
                        distance: "8 km away",
                        score: "75%",
                      },
                      {
                        name: "Black Wireless Earphones Lost",
                        keywords: ["wireless", "audio"],
                        distance: "12 km away",
                        score: "38%",
                      },
                      { name: "Sony WH-1000XM5 Lost", keywords: ["Sony", "WH-1000XM5"], distance: "2 km away", score: "65%" },
                    ].map((item, idx) => (
                      <div key={idx} className="rounded border border-slate-200 p-3 bg-slate-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                            <p className="text-xs text-slate-600 mt-1">📍 {item.distance}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={
                                item.score === "75%" || item.score === "65%"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-red-100 text-red-700"
                              }
                            >
                              {item.score}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2">
                          <p className="text-xs text-slate-600">Matching keywords: {item.keywords.join(", ")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <h5 className="font-bold text-slate-900">Step 3: Final Result</h5>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-slate-600">
                        Top suggestion: <strong>"Red Sony Headphones Lost"</strong> (75% match)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-slate-600">
                        Second suggestion: <strong>"Sony WH-1000XM5 Lost"</strong> (65% match)
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <span className="h-4 w-4">✕</span>
                      <span>Third match filtered out (38% &lt; 40% threshold)</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-emerald-200 bg-emerald-50/40 p-4">
                  <p className="text-sm">
                    <strong className="text-emerald-700">✨ Result:</strong> Sarah sees the "Red Sony Headphones Lost" as the top
                    match and sends a request to John (the person who lost it). They then connect and arrange to return the
                    headphones!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">How Location Bonus Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  <strong>Base Score:</strong> Keyword matches / Total keywords
                </p>
                <p>
                  <strong>Location Check:</strong> If items are within 10 km → add 0.2 (20%) bonus
                </p>
                <div className="mt-4 rounded bg-blue-50 p-3 border border-blue-200">
                  <p className="font-semibold text-blue-900 mb-2">Example:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Keyword score: 0.5 (50%)</li>
                    <li>• Distance: 5 km (within 10 km)</li>
                    <li>• Bonus: +0.2</li>
                    <li>
                      • <strong>Final: 0.7 (70%)</strong>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer CTA */}
      <section className="mx-auto max-w-2xl rounded-lg border border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 p-8 text-center">
        <h3 className="text-xl font-bold text-slate-900">Ready to Find Your Item?</h3>
        <p className="mt-2 text-slate-600">Report a lost or found item now and let our AI help you find matches!</p>
        <div className="mt-6 flex justify-center gap-3">
          <a
            href="/new-lost"
            className="rounded-lg bg-orange-600 px-6 py-2 text-sm font-semibold text-white hover:bg-orange-700 transition"
          >
            Report Lost Item
          </a>
          <a
            href="/new-found"
            className="rounded-lg bg-teal-600 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-700 transition"
          >
            Report Found Item
          </a>
        </div>
      </section>
    </div>
  );
}
