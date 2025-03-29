import React from 'react';

const Members = () => {
  const members = [
    {
      title: 'Andrei C. Tolentino',
      title2: 'Researcher',
      imageSrc: '/images/Andrei.png',
      link: '',
    },
    {
      title: 'Joel G. Salaria',
      title2: 'Project Manager',
      imageSrc: '/images/Joel.png',
      map: 'https://maps.app.goo.gl/quPLWo7wcgX6EMD16',
    },
    {
      title: 'Zyan Lio Asistio',
      title2: 'Head Programmer',
      imageSrc: '/images/Zyan.png',
      map: 'https://maps.app.goo.gl/VSRu6Xj8Cf1bKfzb6',
    },
  ];

  return (
    <div className="w-full h-full xl:flex flex-col xl:py-[5rem]">
      <div className="py-10">
        <div className="flex flex-col w-100 text-[2rem] font-semibold items-center mb-20">
          <h1>Members of JAZ Code</h1>
        </div>

        <div className="mt-5 flex flex-col items-center justify-center gap-20">
          {/* Top member */}
          <div className="z-10 flex flex-col items-center">
            {members.slice(1, 2).map((item, index) => (
              <React.Fragment key={index}>
                <div
                  onClick={() => window.open(item.map, '')}
                  style={{
                    backgroundImage: `url(${item.imageSrc})`,
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                    backgroundColor: 'hsl(var(--background))',
                  }}
                  className="group bg-cover hover:bg-left bg-center bg-no-repeat h-[250px] w-[250px] bg-slate-600 flex justify-center items-end hover:scale-110 duration-300 cursor-pointer rounded-full mb-4"
                ></div>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-semibold">{item.title}</span>
                  <span className="text-sm text-gray-white">{item.title2}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Bottom row with two members */}
          <div className="flex space-x-20">
            {members
              .filter((_, index) => index !== 1)
              .map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div
                    onClick={() => window.open(item.map, '')}
                    style={{
                      backgroundImage: `url(${item.imageSrc})`,
                      borderColor: 'hsl(var(--border))',
                      color: 'hsl(var(--foreground))',
                      backgroundColor: 'hsl(var(--background))',
                    }}
                    className="group bg-cover hover:bg-left bg-center bg-no-repeat h-[250px] w-[250px] bg-slate-600 flex justify-center items-end hover:scale-110 duration-300 cursor-pointer rounded-full mb-4"
                  ></div>
                  <div className="flex flex-col items-center">
                    <span className="text-lg font-semibold">{item.title}</span>
                    <span className="text-sm text-gray-white">
                      {item.title2}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Members;
