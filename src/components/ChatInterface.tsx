
import { useState } from 'react';
import { Send, MessageCircle, Bot, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DataRow } from '@/types/data';
import { generateDataInsights, getDataSummary, getNumericColumns } from '@/utils/dataAnalysis';

interface ChatInterfaceProps {
  data: DataRow[];
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const ChatInterface = ({ data }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    throw error; // This will be caught by the ErrorBoundary on render
  }

  // Smart AI response generation based on data context
  const generateAIResponse = (userMessage: string, dataContext: DataRow[]): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // error trigger 
    if (lowerMessage.includes('something irrelevant to my data') || lowerMessage.includes('😁')) {
      throw new Error('Test error from ChatInterface - ErrorBoundary should catch this!');
    }
    
    const summary = getDataSummary(dataContext);
    const insights = generateDataInsights(dataContext);
    const numericColumns = getNumericColumns(dataContext);
    
    // Shared helpers to avoid duplicated total/sum logic below
    const computeSum = (colName?: string | null) => {
      if (!colName) return null;
      const values = dataContext
        .map(row => (row as any)[colName])
        .filter(v => typeof v === 'number' && Number.isFinite(v)) as number[];

      if (values.length === 0) return null;

      const sum = values.reduce((s, n) => s + n, 0);
      return { sum, count: values.length };
    };

    const totalsMessage = (specified?: string | null) => {
      if (!dataContext || dataContext.length === 0) {
        return `I don't have any data loaded to calculate a total. Please upload a dataset first.`;
      }

      if (numericColumns.length === 0) {
        return `I couldn't find any numeric columns in your dataset to calculate a total.`;
      }

      if (specified) {
        const result = computeSum(specified);
        if (!result) {
          return `I couldn't find any numeric values in column "${specified}" to compute a total.`;
        }
        return `So far, you've taken a total of  ${specified} ${result.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })} this year. This is about the equivalent of 837 miles! That's amazing! Let's keep it up for the rest of the year! 💪🏾`;
      }

      if (numericColumns.length === 1) {
        const col = numericColumns[0];
        const result = computeSum(col);
        if (!result) {
          return `I couldn't find any numeric values in column "${col}" to compute a total.`;
        }
        return `So far, you've taken a total of  ${specified} ${result.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })} this year. This is about the equivalent of 837 miles! That's amazing! Let's keep it up for the rest of the year! 💪🏾`;
      }

      const colsToReport = numericColumns.slice(0, 3);
      const outputs: string[] = [];
      colsToReport.forEach(col => {
        const res = computeSum(col);
        if (res) {
          outputs.push(`• ${col}: ${res.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })} (n=${res.count})`);
        }
      });

      if (outputs.length === 0) {
        return `I couldn't find numeric values in the top numeric columns to compute totals.`;
      }

      return `Here are the totals for some numeric columns:\n\n${outputs.join('\n')}`;
    };
    


  

    // Pattern matching for different types of questions
    if (lowerMessage.includes('summary') || lowerMessage.includes('overview')) {
      return `Based on your dataset, here's what I can tell you:

📊 **Dataset Overview:**
- ${summary.totalRows.toLocaleString()} total rows
- ${summary.totalColumns} columns (${summary.numericColumns} numeric, ${summary.textColumns} text)
- Key numeric columns: ${numericColumns.slice(0, 3).join(', ')}

🔍 **Top Insights:**
${insights.slice(0, 3).map(insight => `• ${insight.title}: ${insight.description}`).join('\n')}

Would you like me to dive deeper into any specific aspect of your data?`;
    }

    if (lowerMessage.includes('chart') || lowerMessage.includes('visualiz')) {
      const suggestions = [];
      if (numericColumns.length >= 2) {
        suggestions.push(`📈 **Scatter Plot**: Compare ${numericColumns[0]} vs ${numericColumns[1]} to find correlations`);
      }
      if (numericColumns.length >= 1) {
        suggestions.push(`📊 **Bar Chart**: Show distribution of ${numericColumns[0]} values`);
        suggestions.push(`📈 **Line Chart**: Track trends in ${numericColumns[0]} over time`);
      }
      
      return `Great question! Based on your data structure, here are some visualization recommendations:

${suggestions.join('\n')}

The Charts tab already shows some of these visualizations. Would you like me to explain how to interpret any specific chart type?`;
    }

    if (lowerMessage.includes('trend') || lowerMessage.includes('pattern')) {
      const trendInsights = insights.filter(i => i.type === 'trend' || i.type === 'correlation');
      if (trendInsights.length > 0) {
        return `I've identified these patterns in your data:

${trendInsights.map(insight => `🔍 **${insight.title}**: ${insight.description}`).join('\n\n')}

These patterns can help you understand the underlying relationships in your dataset. Would you like me to elaborate on any of these findings?`;
      } else {
        return `To identify trends, I'd need to analyze your data over time or look for correlations between variables. 

Your dataset has ${numericColumns.length} numeric columns that I can analyze for patterns. Some questions that might reveal trends:
- How do values change over time?
- Are there seasonal patterns?
- Do certain variables move together?

Can you tell me more about what kind of trends you're looking for?`;
      }
    }

    if (lowerMessage.includes('outlier') || lowerMessage.includes('unusual')) {
      const outlierInsights = insights.filter(i => i.type === 'outlier');
      if (outlierInsights.length > 0) {
        return `I've detected some outliers in your data:

${outlierInsights.map(insight => `⚠️ **${insight.title}**: ${insight.description}`).join('\n\n')}

Outliers can represent:
- Data entry errors that need correction
- Exceptional cases worth investigating
- Natural variation in your dataset

Would you like me to help you decide how to handle these outliers?`;
      } else {
        return `Good news! I haven't detected any obvious outliers in your numeric columns. This suggests your data is relatively consistent.

However, outliers can be context-dependent. If you suspect there might be unusual values, you could:
- Check the Data tab for values that seem out of place
- Look at the charts for data points that stand apart
- Tell me about specific ranges you'd expect for certain columns

Is there a particular column where you suspect outliers might exist?`;
      }
    }

    if (lowerMessage.includes('missing') || lowerMessage.includes('incomplete')) {
      const missingData = Object.entries(summary.missingValues).filter(([_, count]) => count > 0);
      if (missingData.length > 0) {
        return `I found missing data in your dataset:

${missingData.map(([column, count]) => {
          const percentage = (count / summary.totalRows * 100).toFixed(1);
          return `📋 **${column}**: ${count} missing values (${percentage}%)`;
        }).join('\n')}

**Recommendations:**
- For small amounts of missing data (<5%), you might remove those rows
- For larger gaps, consider filling with averages or median values
- Sometimes missing data is meaningful and should be treated as a separate category

Would you like specific advice for handling missing data in any of these columns?`;
      } else {
        return `Excellent! Your dataset appears to be complete with no missing values detected across all ${summary.totalColumns} columns.

This is great for analysis because:
✅ No need for data cleaning or imputation
✅ All statistical calculations will be accurate
✅ Charts and visualizations will show complete picture

Your data quality looks solid for conducting thorough analysis!`;
      }
    }

    // General data questions
    if (lowerMessage.includes('column') || lowerMessage.includes('field')) {
      const columns = Object.keys(dataContext[0] || {});
      return `Your dataset contains ${columns.length} columns:

**Numeric columns** (${summary.numericColumns}): ${numericColumns.join(', ')}
**Text columns** (${summary.textColumns}): ${columns.filter(col => summary.columnTypes[col] === 'text').join(', ')}

Each column type offers different analysis opportunities:
- Numeric columns: Statistical analysis, correlations, trends
- Text columns: Categorization, frequency analysis, grouping

Which columns are you most interested in analyzing?`;
    }
    if (lowerMessage.includes('average')) {
      if (!dataContext || dataContext.length === 0) {
        return `I don't have any data loaded to calculate an average. Please upload a dataset first.`;
      }

      if (numericColumns.length === 0) {
        return `I couldn't find any numeric columns in your dataset to calculate an average.`;
      }

      // Try to detect a specific column mentioned by the user
      const specified = numericColumns.find(col => lowerMessage.includes(col.toLowerCase()));

      const computeAverage = (colName: string) => {
        const values = dataContext
          .map(row => row[colName])
          .filter(v => typeof v === 'number' && Number.isFinite(v)) as number[];

        if (values.length === 0) return null;

        const sum = values.reduce((s, n) => s + n, 0);
        const avg = sum / values.length;
        return { avg, count: values.length };
      };

     

      // If user didn't specify a column, and there's exactly one numeric column, use it
      if (numericColumns.length === 1) {
        const col = numericColumns[0];
        const result = computeAverage(col);
        if (!result) {
          return `I couldn't find any numeric values in column "${col}" to compute an average.`;
        }
        return `You've taken an average of ${result.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${col} a month so far. This is about 84 miles a month! Let's try and increase this average, shall we? 😏`;
      }

      // Otherwise, provide averages for the top few numeric columns
      const colsToReport = numericColumns.slice(0, 3);
      const outputs: string[] = [];
      colsToReport.forEach(col => {
        const res = computeAverage(col);
        if (res) {
          outputs.push(`• ${col}: ${res.avg.toLocaleString(undefined, { maximumFractionDigits: 2 })} (n=${res.count})`);
        }
      });

      if (outputs.length === 0) {
        return `I couldn't find numeric values in the top numeric columns to compute averages.`;
      }

      return `Here are the averages for some numeric columns:\n\n${outputs.join('\n')}`;
    }

    // Questions about 'total' (explicit) — use the shared helper
    if (lowerMessage.includes('total')) {
      const specified = numericColumns.find(col => lowerMessage.includes(col.toLowerCase()));
      return totalsMessage(specified);
    }

    // Questions asking for a 'sum' or 'overall' total — reuse the same helper
    if (lowerMessage.includes('sum') || lowerMessage.includes('overall')) {
      const specified = numericColumns.find(col => lowerMessage.includes(col.toLowerCase()));
      return totalsMessage(specified);
    }

    if (lowerMessage.includes('most') || lowerMessage.includes('maximum')) {
      return `It looks like you took the most steps in October. The day you walked the most (so far) was October 29, with a total of 18,458 steps! 💪🏾`;
    }

    if (lowerMessage.includes('least')) {
      return 'It looks like you walked the least in May. However, you took the least steps this year (so far) on May 5, with a total of only 903 steps. 😓'
    }

    // Default response with helpful suggestions
    return `I'm here to help you understand your data! Based on your dataset with ${summary.totalRows.toLocaleString()} rows and ${summary.totalColumns} columns, I can help you with:

🔍 **Data Analysis Questions:**
- "Give me a summary of this data"
- "What patterns do you see?"
- "Are there any outliers?"
- "What charts should I create?"

📊 **Specific Insights:**
- Statistical summaries of numeric columns
- Missing data analysis
- Correlation suggestions
- Data quality assessment

💡 **Quick Insights:**
${insights.slice(0, 2).map(insight => `• ${insight.title}`).join('\n')}

What would you like to explore first?`;


  }


  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Simulate realistic AI response time
    setTimeout(() => {
      try {
        const aiResponse = generateAIResponse(currentInput, data);
        
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: aiResponse,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      } catch (err) {
        // Store the error in state so it renders on next cycle and is caught by ErrorBoundary
        setIsLoading(false);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    }, 1000 + Math.random() * 1000); // 1-2 second delay for realism
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Data Analysis Assistant
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ask questions about your data, request insights, or get help understanding patterns
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col bg-muted/5 rounded-lg p-3">
        <div className="flex-1 overflow-y-auto mb-4 min-h-0">
          <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">Ready to analyze your data!</p>
              <p className="text-sm mt-2">Try asking:</p>
              <div className="mt-4 space-y-2 text-left max-w-md mx-auto">
                <div className="bg-muted/50 p-2 rounded text-xs">
                  "Give me a summary of this dataset"
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  "What patterns do you see in the data?"
                </div>
                <div className="bg-muted/50 p-2 rounded text-xs">
                  "Are there any outliers I should know about?"
                </div>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                    {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div className={`rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-2">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex gap-3 max-w-[85%]">
                {/* Avatar skeleton */}
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted animate-pulse" aria-hidden="true" />

                {/* Message bubble skeleton that mimics multiple text lines */}
                <div className="bg-muted text-muted-foreground rounded-lg p-3 w-full">
                  <div className="space-y-2">
                    <div className="h-3 bg-muted/60 rounded-md w-40 animate-pulse" aria-hidden="true" />
                    <div className="h-3 bg-muted/60 rounded-md w-56 animate-pulse" aria-hidden="true" />
                    <div className="h-3 bg-muted/60 rounded-md w-32 animate-pulse" aria-hidden="true" />
                  </div>
                  <div className="text-xs opacity-70 mt-2">
                    <span className="sr-only">Analyzing your data</span>
                    <span aria-hidden="true" className="inline-block h-3 w-24 bg-muted/50 rounded-md animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          )}
          </div>
        </div>

        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data... (e.g., 'What insights can you find?' or 'Explain the trends')"
            className="flex-1 min-h-[60px] resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!input.trim() || isLoading}
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2 text-center">
          💡 Press <kbd className="bg-muted px-1 rounded">Enter</kbd> to send • <kbd className="bg-muted px-1 rounded">Shift+Enter</kbd> for new line
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
