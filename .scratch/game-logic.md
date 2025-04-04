/*
  Determining Hands/Card Combos
  
  POSSIBLE APPROACHES: 
  
    - Point-based (Add up rank points of all cards)
    
    - High-low evaluation: Starting at best hand, 
      evaluate match of cards with hands
  
  Hand Rules:
  
  Straight-flush:
    1) 5 cards are 1 suit
    2) Rank of 5 are sequential;
    
  Four-of-a-Kind
    1) 4 of 5 cards have same value;
    2) Highest of remaining cards is kicker
      
    
  Full House
    1) 3 cards of same value;
    2) Remaining 2 cards have same value;
    
  Flush
    0) No incremental sequences of 5 in length
    1) 5 cards are 1 suit
    
  Straight
    0) Less than 5 occurences of any one suit;
    1) Rank of 5 cards are sequential;
    
  
  Three-of-a-Kind
    0) Less than 5 occurences of any one suit and no incremental sequences of 5 in length
    1) 3 of 5 cards have same value;
    2) Remaining 2 cards have different values
    3) Highest of remaining cards is kicker

  Two Pair
    0) Less than 5 occurences of any one suit and no incremental sequences of 5 in length
    1) 2 of 5 cards same value;
    2) 2 of Remaining 3 cards share value different than pair 1;
    3) Highest of remaining cards is kicker;
    
  One Pair
    0) Less than 5 occurences of any one suit and no incremental sequences of 5 in length
    1) 2 of 5 cards same value;
    2) Remaining 3 cards have different values
    3) Highest of remaining cards is kicker;
    
  High Card
    0) Less than 5 occurences of any one suit 
    1) No incremental sequences of 5 in length
    3) No more than one occurences of any card value
    
*/
