import { useState, useCallback, useEffect } from 'react';
import { Checklist, Question } from '@/types/checklist';

export interface ClientResponse {
  questionId: string;
  answer: string;
}

export interface ClientResponseState {
  hasResponses: boolean;
  isShared: boolean;
  sharedAt: Date | null;
  totalQuestions: number;
  answeredQuestions: number;
  responses: ClientResponse[];
}

// Simulate client responses after sharing
const generateMockResponses = (checklist: Checklist): ClientResponse[] => {
  const responses: ClientResponse[] = [];
  
  const processQuestion = (question: Question) => {
    // Simulate random responses based on answer type
    let answer = '';
    switch (question.answerType) {
      case 'yes-no':
        answer = Math.random() > 0.5 ? 'Yes' : 'No';
        break;
      case 'yes-no-na':
        const options = ['Yes', 'No', 'NA'];
        answer = options[Math.floor(Math.random() * options.length)];
        break;
      case 'long-answer':
        answer = 'Client provided response for this question. This is a sample answer that demonstrates the client\'s input.';
        break;
      case 'date':
        answer = new Date().toISOString().split('T')[0];
        break;
      case 'amount':
        answer = (Math.random() * 10000).toFixed(2);
        break;
      case 'dropdown':
      case 'multiple-choice':
        if (question.options && question.options.length > 0) {
          answer = question.options[Math.floor(Math.random() * question.options.length)];
        }
        break;
      case 'toggle':
        answer = Math.random() > 0.5 ? 'true' : 'false';
        break;
      default:
        answer = 'Sample response';
    }
    
    if (answer) {
      responses.push({
        questionId: question.id,
        answer
      });
    }
    
    // Process sub-questions
    if (question.subQuestions) {
      question.subQuestions.forEach(processQuestion);
    }
  };
  
  checklist.sections.forEach(section => {
    section.questions.forEach(processQuestion);
  });
  
  return responses;
};

// Count total questions in checklist
const countQuestions = (checklist: Checklist): number => {
  let count = 0;
  checklist.sections.forEach(section => {
    section.questions.forEach(q => {
      count++;
      if (q.subQuestions) {
        count += q.subQuestions.length;
      }
    });
  });
  return count;
};

export function useClientResponses(checklist: Checklist | null) {
  const [state, setState] = useState<ClientResponseState>({
    hasResponses: false,
    isShared: false,
    sharedAt: null,
    totalQuestions: 0,
    answeredQuestions: 0,
    responses: []
  });
  
  const [isApplyingResponses, setIsApplyingResponses] = useState(false);
  const [currentApplyingIndex, setCurrentApplyingIndex] = useState(-1);
  const [applyingQuestionId, setApplyingQuestionId] = useState<string | null>(null);

  // Update total questions when checklist changes
  useEffect(() => {
    if (checklist) {
      setState(prev => ({
        ...prev,
        totalQuestions: countQuestions(checklist)
      }));
    }
  }, [checklist]);

  // Share with client - triggers response simulation after delay
  const shareWithClient = useCallback(() => {
    if (!checklist) return;
    
    setState(prev => ({
      ...prev,
      isShared: true,
      sharedAt: new Date(),
      hasResponses: false,
      responses: [],
      answeredQuestions: 0
    }));
    
    // Simulate client responding after 3 seconds
    setTimeout(() => {
      const mockResponses = generateMockResponses(checklist);
      setState(prev => ({
        ...prev,
        hasResponses: true,
        responses: mockResponses,
        answeredQuestions: mockResponses.length
      }));
    }, 3000);
  }, [checklist]);

  // Apply responses to checklist one by one
  const applyResponses = useCallback((
    onUpdateQuestion: (questionId: string, answer: string) => void,
    onComplete: () => void
  ) => {
    const responses = state.responses;
    if (responses.length === 0) return;
    
    setIsApplyingResponses(true);
    setCurrentApplyingIndex(0);
    
    // Use a recursive setTimeout approach for more reliable state updates
    const applyNext = (index: number) => {
      if (index >= responses.length) {
        setIsApplyingResponses(false);
        setCurrentApplyingIndex(-1);
        setApplyingQuestionId(null);
        setState(prev => ({
          ...prev,
          hasResponses: false,
          responses: [],
          answeredQuestions: 0,
          isShared: false,
          sharedAt: null
        }));
        onComplete();
        return;
      }
      
      const response = responses[index];
      setApplyingQuestionId(response.questionId);
      setCurrentApplyingIndex(index);
      
      // Apply the answer after a brief delay for visual effect
      setTimeout(() => {
        onUpdateQuestion(response.questionId, response.answer);
        
        // Schedule next update
        setTimeout(() => {
          applyNext(index + 1);
        }, 400);
      }, 200);
    };
    
    // Start the sequence
    applyNext(0);
  }, [state.responses]);

  // Reset state
  const resetState = useCallback(() => {
    setState({
      hasResponses: false,
      isShared: false,
      sharedAt: null,
      totalQuestions: checklist ? countQuestions(checklist) : 0,
      answeredQuestions: 0,
      responses: []
    });
    setIsApplyingResponses(false);
    setCurrentApplyingIndex(-1);
    setApplyingQuestionId(null);
  }, [checklist]);

  return {
    ...state,
    isApplyingResponses,
    currentApplyingIndex,
    applyingQuestionId,
    shareWithClient,
    applyResponses,
    resetState
  };
}
