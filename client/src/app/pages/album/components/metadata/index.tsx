import React from 'react';

interface MetadataProps {
  metadata: Record<string, unknown> | undefined;
}

/**
 * Display metadata from exifr library in grid
 * @param props Component properties
 * @return React component
 */
const Metadata: React.VFC<MetadataProps> = (props) => {
  const metadata = props.metadata;

  if (!metadata) {
    return <span>No metadata</span>;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
    }} className="pb-3">
      {Object.entries(metadata).map(([key, value]) => {
        return (
          <React.Fragment key={key}>
            <span>{key}</span>
            <span>{JSON.stringify(value)}</span>
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Metadata;
