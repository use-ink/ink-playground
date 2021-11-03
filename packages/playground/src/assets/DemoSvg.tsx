import * as React from 'react';

function SvgComponent(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width={10} height={13} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M5.75 3.688V.5H1.062a.555.555 0 00-.562.563v10.874c0 .329.234.563.563.563h7.875a.555.555 0 00.562-.563V4.25H6.312a.542.542 0 01-.562-.563zm1.523 5.085H5.75v1.875a.403.403 0 01-.375.375h-.75a.385.385 0 01-.375-.375V8.773H2.703c-.328 0-.492-.421-.258-.656l2.25-2.25a.46.46 0 01.586 0l2.25 2.25c.235.235.07.656-.258.656zm2.063-5.812L7.039.664A.665.665 0 006.641.5H6.5v3h3v-.14c0-.141-.07-.282-.164-.4z"
        fill="#D3D4DB"
      />
    </svg>
  );
}

export default SvgComponent;
