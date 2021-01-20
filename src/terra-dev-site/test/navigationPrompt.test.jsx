import React, { useState } from 'react';
import UnsavedChangesPrompt from '@cerner/terra-application/lib/unsaved-changes-prompt';

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
      {hasPendingState ? <UnsavedChangesPrompt description="ExampleComponent" /> : undefined}
    </div>
  );
};

export default ExampleComponent;
