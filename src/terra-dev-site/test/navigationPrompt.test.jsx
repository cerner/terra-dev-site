import React, { useState } from 'react';
import NavigationPrompt from 'terra-application/lib/navigation-prompt';

const ExampleComponent = () => {
  const [hasPendingState, setHasPendingState] = useState(false);

  return (
    <div>
      <p>This component toggles between having and not having pending state.</p>
      <p>
        <button id="PendingStateButton" type="button" onClick={() => { setHasPendingState(!hasPendingState); }}>
          {hasPendingState ? 'Clear Pending State' : 'Set Pending State'}
        </button>
      </p>
      {hasPendingState ? <NavigationPrompt description="ExampleComponent" /> : undefined}
    </div>
  );
};

export default ExampleComponent;
