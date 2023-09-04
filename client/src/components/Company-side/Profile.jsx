import React,{useState} from 'react';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('posts');
  return (
    <section className="h-[calc(100vh+35rem)] bg-pink-50">
    <div className="container py-5 h-screen">
        <div className="flex justify-center h-screen">
        <div className="lg:w-9/12 xl:w-7/12 bg-white">
            <div className="bg-white rounded-t text-black flex flex-row" style={{ height: '200px' }}>
            <div className="ms-4 mt-5 flex flex-col items-center" style={{ width: '150px' }}>
                <img src="./public/skillset logo.jpg"
                alt="Generic placeholder image" className="img-fluid img-thumbnail mt-4 mb-16 w-32 h-32 rounded-full"
                />
            </div>
            <div className="ms-3 flex flex-col" style={{ marginTop: '130px' }}>
                <h5>Andy Horwitz</h5>
                <p>Headline</p>
            </div>
            </div>
            <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="flex justify-between text-center py-1">
                <div className='flex w-50 justify-center h-11'>
                    <button className="p-1 w-36 h-10 border border-pink-400 rounded bg-pink-100 shadow-md hover:bg-pink-500">Edit profile</button>
                </div>
                <div className='flex inline-block'>
                    <div>
                    <p className="mb-1 text-lg">253</p>
                    <p className="text-xs text-muted mb-0">Posts</p>
                    </div>
                    <div className='ml-5'>
                    <p className="mb-1 text-lg">1026</p>
                    <p className="text-xs text-muted mb-0">Jobs</p>
                    </div>
                    <div className='ml-5'>
                    <p className="mb-1 text-lg">1026</p>
                    <p className="text-xs text-muted mb-0">Hire Pool</p>
                    </div><div className='ml-5'>
                    <p className="mb-1 text-lg">1026</p>
                    <p className="text-xs text-muted mb-0">People</p>
                    </div>
                </div>
            </div>
            </div>
            <div className="card-body p-4 text-black">
            <div className="mb-5">
                <p className="text-xl font-normal mb-1">Contact & Address</p>
                <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <p className="italic mb-1">Address: Lives in New York</p>
                <p className="italic mb-0">Email: avsdhsv@dbsjbhcs</p>
                <p className="italic mb-0">Contact No: 1234557890</p>
                </div>
            </div>
            <div className="mb-5">
                <p className="text-xl font-normal mb-1">About</p>
                <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                <p className="italic mb-1">Web Developer</p>
                <p className="italic mb-1">Lives in New York</p>
                <p className="italic mb-0">Photographer</p>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <div>
                <button
                    className={`p-1 w-20 ml-5 border rounded-full shadow-md ${
                    activeTab === 'posts' ? 'bg-pink-400' : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveTab('posts')}
                >
                    Posts
                </button>
                <button
                    className={`p-1 w-20 ml-5 border rounded-full shadow-md ${
                    activeTab === 'jobs' ? 'bg-pink-400' : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveTab('jobs')}
                >
                    Jobs
                </button>
                <button
                    className={`p-1 w-24 ml-5 border rounded-full shadow-md ${
                    activeTab === 'hirePool' ? 'bg-pink-400' : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveTab('hirePool')}
                >
                    Hire pool
                </button>
                <button
                    className={`p-1 w-24 ml-5 border rounded-full shadow-md ${
                    activeTab === 'people' ? 'bg-pink-400' : 'bg-gray-300'
                    }`}
                    onClick={() => setActiveTab('people')}
                >
                    People
                </button>
                </div>
                <p className="mb-0"><a href="#!" className="p-1 border border-pink-400 rounded bg-pink-100 shadow-md hover:bg-pink-500">Show all</a></p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="mb-2">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
                    alt="image 1" className="w-full rounded-3"
                />
                </div>
                <div className="mb-2">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
                    alt="image 2" className="w-full rounded-3"
                />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="mb-2">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
                    alt="image 3" className="w-full rounded-3"
                />
                </div>
                <div className="mb-2">
                <img src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
                    alt="image 4" className="w-full rounded-3"
                />
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    </section>
  );
}

export default Profile;
