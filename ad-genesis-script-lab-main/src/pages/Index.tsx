import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Video, 
  Megaphone, 
  Presentation, 
  MessageSquare, 
  FileText, 
  Wand2,
  Copy,
  Download,
  RefreshCw,
  Sparkles,
  Check,
  Star,
  Zap,
  Target,
  Users
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AuthButton from '@/components/AuthButton';

const Index = () => {
  const { user, loading } = useAuth();
  const [scriptType, setScriptType] = useState('');
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('');
  const [length, setLength] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const scriptTypes = [
    { id: 'youtube', label: 'YouTube Video', icon: Video, description: 'Engaging video scripts for YouTube content', color: 'bg-red-500' },
    { id: 'advertisement', label: 'Advertisement', icon: Megaphone, description: 'Compelling ad copy that converts', color: 'bg-blue-500' },
    { id: 'presentation', label: 'Presentation', icon: Presentation, description: 'Professional presentation scripts', color: 'bg-green-500' },
    { id: 'social', label: 'Social Media', icon: MessageSquare, description: 'Social media content and captions', color: 'bg-pink-500' },
    { id: 'explainer', label: 'Explainer Video', icon: Video, description: 'Clear and informative explainer videos', color: 'bg-purple-500' },
    { id: 'sales', label: 'Sales Pitch', icon: Megaphone, description: 'Persuasive sales presentations', color: 'bg-orange-500' },
    { id: 'educational', label: 'Educational', icon: FileText, description: 'Educational and training content', color: 'bg-indigo-500' },
    { id: 'podcast', label: 'Podcast', icon: MessageSquare, description: 'Podcast episodes and interviews', color: 'bg-teal-500' }
  ];

  const tones = [
    'Professional', 'Casual', 'Friendly', 'Authoritative', 'Conversational',
    'Energetic', 'Humorous', 'Inspirational', 'Persuasive', 'Educational'
  ];

  const lengths = [
    { value: 'short', label: 'Short (30-60 seconds)' },
    { value: 'medium', label: 'Medium (1-3 minutes)' },
    { value: 'long', label: 'Long (3-5 minutes)' },
    { value: 'extended', label: 'Extended (5+ minutes)' }
  ];

  const audiences = [
    'General Public', 'Business Professionals', 'Students', 'Entrepreneurs',
    'Tech Enthusiasts', 'Parents', 'Young Adults', 'Seniors', 'Investors',
    'Content Creators', 'Small Business Owners', 'Marketing Professionals'
  ];

  const generateHighQualityPrompt = () => {
    const selectedType = scriptTypes.find(type => type.id === scriptType);
    
    let basePrompt = '';
    
    switch (scriptType) {
      case 'youtube':
        basePrompt = `Create a compelling YouTube video script that hooks viewers in the first 5 seconds and maintains engagement throughout. Structure: Hook → Problem/Topic Introduction → Value Delivery → Call to Action.`;
        break;
      case 'advertisement':
        basePrompt = `Write a high-converting advertisement script using the AIDA framework (Attention, Interest, Desire, Action). Focus on emotional triggers and clear value propositions.`;
        break;
      case 'presentation':
        basePrompt = `Develop a professional presentation script with clear transitions, compelling storytelling, and actionable insights. Include speaker notes and timing suggestions.`;
        break;
      case 'social':
        basePrompt = `Create engaging social media content that encourages interaction and shares. Include hashtag suggestions and optimal posting strategies.`;
        break;
      case 'explainer':
        basePrompt = `Write a clear, educational explainer video script that simplifies complex topics. Use analogies, examples, and step-by-step explanations.`;
        break;
      case 'sales':
        basePrompt = `Craft a persuasive sales pitch script addressing pain points, presenting solutions, and overcoming objections. Include strategic pauses and emphasis points.`;
        break;
      case 'educational':
        basePrompt = `Develop an educational script that facilitates learning through clear explanations, examples, and interactive elements. Include assessment questions.`;
        break;
      case 'podcast':
        basePrompt = `Create a podcast script with natural conversation flow, interesting segments, and engaging guest interactions. Include transition phrases and timing cues.`;
        break;
      default:
        basePrompt = `Create a professional script for the specified content type.`;
    }

    return `${basePrompt}

Topic: ${topic}
Tone: ${tone}
Target Length: ${length}
Target Audience: ${targetAudience}
Additional Requirements: ${additionalDetails}

Please provide:
1. A compelling hook/opening
2. Well-structured main content
3. Clear call-to-action
4. Suggested delivery notes
5. Estimated timing

Make the script engaging, actionable, and tailored to the specific audience and platform requirements.`;
  };

  const generateScript = async () => {
    if (!scriptType || !topic || !tone || !length || !targetAudience) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsGenerating(true);
    
    try {
      const prompt = generateHighQualityPrompt();
      console.log('Generated prompt:', prompt);
      
      console.log('API Key:', import.meta.env.VITE_OPENROUTER_API_KEY);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Script Generator'
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error(`Failed to generate script: ${errorData.error?.message || JSON.stringify(errorData)}`);
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response:', data);
      
      if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
        setGeneratedScript(data.choices[0].message.content);
        toast.success('Script generated successfully!');
      } else {
        throw new Error('Invalid API response format');
      }
      
    } catch (error: any) {
      console.error('Error generating script:', error);
      toast.error(`Failed to generate script: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockScript = () => {
    const selectedType = scriptTypes.find(type => type.id === scriptType);
    
    return `# ${selectedType?.label} Script: ${topic}

## Opening Hook (0-5 seconds)
"Did you know that ${topic.toLowerCase()} could completely transform your approach to [relevant area]? In the next ${length === 'short' ? '60 seconds' : '3 minutes'}, I'll show you exactly how."

## Main Content
[Tailored for ${targetAudience} in a ${tone.toLowerCase()} tone]

### Key Point 1: The Problem
Many people struggle with ${topic.toLowerCase()} because they don't have the right strategy. This leads to frustration and missed opportunities.

### Key Point 2: The Solution
Here's what actually works: [specific actionable advice related to ${topic}]

### Key Point 3: Implementation
To get started immediately:
1. First step based on your topic
2. Second actionable item
3. Third implementation tip

## Call to Action
Ready to take your ${topic.toLowerCase()} to the next level? 

${additionalDetails ? `\n## Additional Notes\n${additionalDetails}` : ''}

## Delivery Notes
- Speak with ${tone.toLowerCase()} energy
- Pause for 2 seconds after the hook
- Emphasize key numbers and statistics
- End with clear next steps

**Estimated Duration:** ${length === 'short' ? '30-60 seconds' : length === 'medium' ? '1-3 minutes' : '3-5 minutes'}
**Target Audience:** ${targetAudience}`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedScript);
    toast.success('Script copied to clipboard!');
  };

  const downloadScript = () => {
    const blob = new Blob([generatedScript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scriptType}-script-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Script downloaded!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="h-12 w-12 animate-spin mx-auto mb-4 text-purple-400" />
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header */}
      <div className="border-b border-white/10 backdrop-blur-sm bg-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  AI Script Generator
                </h1>
                <p className="text-gray-300 text-lg">Create high-converting scripts with AI-powered precision</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-6">
            Up your content game with{' '}
            <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI-powered scripts
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            AI Script Generator helps you create compelling content, craft persuasive ads, 
            and deliver engaging presentations that convert.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Check className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-gray-300">High-converting scripts</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Check className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-gray-300">Multiple content types</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Check className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-gray-300">Advanced customization</span>
            </div>
            <div className="flex items-center gap-3 text-left">
              <div className="p-2 bg-purple-600/20 rounded-lg">
                <Check className="h-5 w-5 text-purple-400" />
              </div>
              <span className="text-gray-300">Professional quality</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Configuration */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                    <Wand2 className="h-5 w-5 text-white" />
                  </div>
                  Script Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Script Type Selection */}
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-200 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Choose Your Script Type *
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    {scriptTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setScriptType(type.id)}
                          className={`group p-4 rounded-xl border text-left transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20 ${
                            scriptType === type.id
                              ? 'border-purple-500 bg-gradient-to-r from-purple-600/20 to-pink-600/20 ring-2 ring-purple-400'
                              : 'border-white/10 hover:border-purple-400/50 bg-black/20'
                          }`}
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg ${type.color} group-hover:scale-110 transition-transform`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium text-sm text-white">{type.label}</span>
                          </div>
                          <p className="text-xs text-gray-400">{type.description}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Topic */}
                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-gray-200 flex items-center gap-2">
                    <Zap className="h-4 w-4" />
                    Topic/Subject *
                  </Label>
                  <Input
                    id="topic"
                    placeholder="e.g., Digital Marketing Tips, Product Launch, Company Introduction"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                  />
                </div>

                {/* Tone and Length */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label className="text-gray-200">Tone *</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger className="bg-black/20 border-white/10 text-white focus:border-purple-400">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {tones.map((t) => (
                          <SelectItem key={t} value={t} className="text-white hover:bg-purple-600/20">{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-gray-200">Length *</Label>
                    <Select value={length} onValueChange={setLength}>
                      <SelectTrigger className="bg-black/20 border-white/10 text-white focus:border-purple-400">
                        <SelectValue placeholder="Select length" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/10">
                        {lengths.map((l) => (
                          <SelectItem key={l.value} value={l.value} className="text-white hover:bg-purple-600/20">{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Target Audience */}
                <div className="space-y-3">
                  <Label className="text-gray-200 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Target Audience *
                  </Label>
                  <Select value={targetAudience} onValueChange={setTargetAudience}>
                    <SelectTrigger className="bg-black/20 border-white/10 text-white focus:border-purple-400">
                      <SelectValue placeholder="Select target audience" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10">
                      {audiences.map((audience) => (
                        <SelectItem key={audience} value={audience} className="text-white hover:bg-purple-600/20">{audience}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Details */}
                <div className="space-y-3">
                  <Label htmlFor="details" className="text-gray-200">Additional Requirements</Label>
                  <Textarea
                    id="details"
                    placeholder="Any specific requirements, key points to include, or style preferences..."
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    rows={3}
                    className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 focus:border-purple-400 focus:ring-purple-400/20"
                  />
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={generateScript}
                  disabled={isGenerating || !scriptType || !topic || !tone || !length || !targetAudience}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                      Generating Your Script...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Amazing Script
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Generated Script */}
          <div className="space-y-6">
            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-white">
                    <div className="p-2 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    Your Generated Script
                  </CardTitle>
                  {generatedScript && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 hover:scale-105 transition-all duration-200"
                      >
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={downloadScript}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 hover:scale-105 transition-all duration-200"
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {generatedScript ? (
                  <div className="space-y-4">
                    <Textarea
                      value={generatedScript}
                      onChange={(e) => setGeneratedScript(e.target.value)}
                      className="min-h-[600px] font-mono text-sm bg-black/20 border-white/10 text-white focus:border-green-400 focus:ring-green-400/20"
                      placeholder="Your generated script will appear here..."
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-full blur-xl"></div>
                      <FileText className="relative h-16 w-16 mx-auto text-gray-500" />
                    </div>
                    <p className="text-xl font-medium text-gray-300 mb-2">Ready to create something amazing?</p>
                    <p className="text-sm text-gray-500">
                      Fill in the form and click "Generate Amazing Script" to get started. Optionally, log in for more features.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              10k+
            </div>
            <p className="text-gray-400">Scripts Generated</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              95%
            </div>
            <p className="text-gray-400">User Satisfaction</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              24/7
            </div>
            <p className="text-gray-400">AI Availability</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
