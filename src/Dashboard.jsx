import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TextInput, Dropdown, Checkbox, Table } from 'flowbite-react';
import { HiSearch } from 'react-icons/hi';
import { GoPencil } from 'react-icons/go';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { GrFormPrevious } from 'react-icons/gr';
import { MdNavigateNext } from 'react-icons/md';

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(10);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
    };

    fetchPosts();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePagination = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSort = (field) => {
    const sortedPosts = [...posts].sort((a, b) => a[field].localeCompare(b[field]));
    setPosts(sortedPosts);
  };

  const handleAction = (action, postId) => {
    if (action === 'edit') {
      alert(`Edit post with ID: ${postId}`);
    }
    if (action === 'delete') {
      setPosts(posts.filter(post => post.id !== postId));
      
    }
    if (action === 'view') {
      alert(`View post with ID: ${postId}`);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  return (
    <>
      <div className="p-6 border-4 border-indigo-600 rounded-lg m-2">
        <div>
          <div className="max-w-md">
            <TextInput
              id="search"
              type="text"
              icon={HiSearch}
              placeholder="Search posts"
              required
              onChange={handleSearch}
            />
          </div>
        </div>

        <div>
          <div className="overflow-x-auto pt-4">
            <Table hoverable>
              <Table.Head>
                <Table.HeadCell className="p-4">
                  <Checkbox />
                </Table.HeadCell>
                <Table.HeadCell onClick={() => handleSort('title')}>Title</Table.HeadCell>
                <Table.HeadCell onClick={() => handleSort('body')}>Body</Table.HeadCell>
                <Table.HeadCell>Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {currentPosts.map(post => (
                  <Table.Row key={post.id}>
                    <Table.Cell className="p-4">
                      <Checkbox />
                    </Table.Cell>
                    <Table.Cell>{post.title}</Table.Cell>
                    <Table.Cell>{post.body}</Table.Cell>
                    <Table.Cell>
                      <button onClick={() => handleAction('edit', post.id)}>
                        <GoPencil />
                      </button>
                      <button onClick={() => handleAction('delete', post.id)}>
                        <FaRegTrashAlt />
                      </button>
                      <button onClick={() => handleAction('view', post.id)}>
                        <HiOutlineDotsHorizontal />
                      </button>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex gap-7">
            <p>{"active posts"}</p>
            <span>{filteredPosts.length}/{posts.length}</span>
          </div>

          <div className="flex gap-4">
            <div className="flex gap-2">
              <p>Rows per page</p>
              <Dropdown label={postsPerPage} dismissOnClick={false}>
                <Dropdown.Item onClick={() => setPostsPerPage(10)}>10</Dropdown.Item>
                <Dropdown.Item onClick={() => setPostsPerPage(20)}>20</Dropdown.Item>
                <Dropdown.Item onClick={() => setPostsPerPage(25)}>25</Dropdown.Item>
                <Dropdown.Item onClick={() => setPostsPerPage(30)}>30</Dropdown.Item>
              </Dropdown>
            </div>
            <div>
              <p>{indexOfFirstPost +   1}-{Math.min(indexOfLastPost, filteredPosts.length)} of {filteredPosts.length}</p>
            </div>

            <div>
              <button onClick={() => handlePagination(currentPage -   1)} disabled={currentPage ===   1}>
                <GrFormPrevious />
              </button>
              <button onClick={() => handlePagination(currentPage +   1)} disabled={currentPage === Math.ceil(filteredPosts.length / postsPerPage)}>
                <MdNavigateNext />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
