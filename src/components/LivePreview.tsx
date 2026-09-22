import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

interface LivePreviewProps {
  code: string;
}

export function LivePreview({ code }: LivePreviewProps) {
  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>미리보기</h3>
      </div>
      <div className="preview-content">
        <LiveProvider code={code} noInline>
          <div className="preview-render">
            <ReactLivePreview />
          </div>
          <LiveError className="preview-error" />
        </LiveProvider>
      </div>
    </div>
  );
}
