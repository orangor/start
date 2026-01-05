export interface ChatMessage {
  role: string;
  content: string;
  type?: 'reasoning' | 'content';  // 添加消息类型
}

export interface ChatCompletionRequest {
  messages: ChatMessage[]
  model: 'deepseek-chat'
  frequency_penalty?: number
  max_tokens?: number
  presence_penalty?: number
  response_format?: {
    type: 'text'
  }
  stop?: string[] | null
  stream?: boolean
  stream_options?: any | null
  temperature?: number
  top_p?: number
  tools?: any[] | null
  tool_choice?: 'none' | string
  logprobs?: boolean
  top_logprobs?: number | null
}

export interface ChatCompletionResponse {
  message: ChatMessage
  logprobs?: {
    content: Array<{
      token: string
      logprob: number
      top_logprobs?: Array<{
        token: string
        logprob: number
      }>
    }>
  }
}
